import { Brackets, SelectQueryBuilder, WhereExpression } from 'typeorm';
import { isEmpty } from 'class-validator';

export const MainRepository = () => {
  return {
    async getOne(resourceOptions?: object) {
      const alias: string = this.generateAliasName();
      const queryBuilder = this.createQueryBuilder(alias);

      this.applyResourceOptions(alias, resourceOptions, queryBuilder);
      return queryBuilder.getOne();
    },

    async getOneById(id: number, resourceOptions?: object) {
      const alias: string = this.generateAliasName();
      const queryBuilder = this.createQueryBuilder(alias);

      this.applyResourceOptions(alias, resourceOptions, queryBuilder);
      queryBuilder.andWhere(`${alias}.id = :id`, { id: id });
      return queryBuilder.getOne();
    },

    async getManyAndCount(resourceOptions?: object) {
      const alias: string = this.generateAliasName();
      const queryBuilder = this.createQueryBuilder(alias);

      this.applyResourceOptions(alias, resourceOptions, queryBuilder);
      return {
        total_data: await queryBuilder.getCount(),
        rows: await queryBuilder.getMany(),
      };
    },

    async getMany(resourceOptions?: object) {
      const alias: string = this.generateAliasName();
      const queryBuilder = this.createQueryBuilder(alias);

      this.applyResourceOptions(alias, resourceOptions, queryBuilder);
      return queryBuilder.getMany();
    },

    async applyResourceOptions(mainAlias: string, options: any, queryBuilder: SelectQueryBuilder<any>) {
      if (!options) {
        return;
      }

      if (options.order) {
        for (const [sort, order] of Object.entries(options.order)) {
          const sortSplited = sort.split(/\.(?=[^\.]+$)/);
          let whatToSort = '';

          if (!sort.includes('.')) {
            whatToSort = mainAlias + '.' + sort;
          } else {
            whatToSort = mainAlias + '__' + sortSplited[0].split('.').join('__') + '.' + sortSplited[1];
          }

          queryBuilder.addOrderBy(whatToSort, options.order[sort]);
        }
      }

      if (options.take) {
        queryBuilder.take(options.take);
      }

      if (options.skip) {
        queryBuilder.skip(options.skip);
      }

      if (options.relations) {
        options.relations.forEach((relation: string) => {
          const splitedRelation = relation.split('.');
          let alias = '';
          let property = '';

          for (let index = 0; index < splitedRelation.length; index++) {
            property = index === 0 ? mainAlias + '.' + splitedRelation[index] : alias + '.' + splitedRelation[index];
            alias = index === 0 ? mainAlias + '__' + splitedRelation[index] : alias + '__' + splitedRelation[index];

            const scopeIndex = options.scopes.findIndex((scope: any) => {
              return alias == `${mainAlias + '__'}${scope.name.split('.').join('__')}`;
            });

            if (scopeIndex > -1) {
              return queryBuilder.leftJoinAndSelect(
                property,
                alias,
                options.scopes[scopeIndex].condition.replace('{alias}', alias),
                options.scopes[scopeIndex].parameters,
              );
            }

            queryBuilder.leftJoinAndSelect(property, alias);
          }
        });
      }

      if (options.filters && options.filters.length) {
        this.applyFilter(options.filters, options.filtersByOr, queryBuilder, mainAlias);
      }

      return queryBuilder;
    },
    generateAliasName(): string {
      return this.metadata.tableNameWithoutPrefix;
    },
    applyFilter(filters: any, filtersByOr: any, queryBuilder: SelectQueryBuilder<any>, alias: string) {
      queryBuilder.andWhere(
        new Brackets((qb1) => {
          this.buildFilters(qb1, filters, alias);

          if (filtersByOr | filtersByOr.length) {
            qb1.orWhere(
              new Brackets((qb2) => {
                this.buildFilters(qb2, filtersByOr, alias);
              }),
            );
          }
        }),
      );
    },
    buildFilters(queryBuilder: SelectQueryBuilder<any> | WhereExpression, filters: any, alias: string) {
      for (let index = 0; index < filters.length; index++) {
        const element = filters[index];
        const not = element.not;
        const operator = element.operator;
        let value = element.value;
        let sqlOperator = '';
        let whatToFilter = '';
        let queryWhere = '';
        let queryParameters: any = {};
        let randomStr1 = String((Math.random() * 1e32).toString(36));
        let randomStr2 = String((Math.random() * 1e32).toString(36));
        let queryParameterName = String(`(:${randomStr1})`);

        if (!element.column.includes('.')) {
          whatToFilter = alias + '.' + element.column;
        } else {
          let elementSplited = element.column.split(/\.(?=[^\.]+$)/);
          whatToFilter = alias + '__' + elementSplited[0].split('.').join('__') + '.' + elementSplited[1];
        }

        // Operators
        switch (operator) {
          // String contains
          case 'ct':
            value = '%' + value + '%';
            sqlOperator = not ? 'NOT LIKE' : 'LIKE';
            break;

          // Equals
          case 'eq':
            value = value;
            sqlOperator = not ? 'NOT !=' : '=';
            break;

          // Starts with
          case 'sw':
            value = value + '%';
            sqlOperator = not ? 'NOT LIKE' : 'LIKE';
            break;

          // Ends with
          case 'ew':
            value = '%' + value;
            sqlOperator = not ? 'NOT LIKE' : 'LIKE';
            break;

          // Greater than
          case 'gt':
            sqlOperator = not ? '<' : '>';
            break;

          // Greater than or equalTo
          case 'gte':
            sqlOperator = not ? '<' : '>=';
            break;

          // Lesser than or equalTo
          case 'lte':
            sqlOperator = not ? '>' : '<=';
            break;

          // Lesser than
          case 'lt':
            sqlOperator = not ? '>' : '<';
            break;

          // In array
          case 'in':
            value = value.split(',');
            sqlOperator = not ? 'NOT IN' : 'IN';
            break;

          // Between
          case 'bt':
            const firstValue = value.split(',')[0];
            const secondValue = value.split(',')[1];
            queryParameterName = String(`:${randomStr1} AND :${randomStr2}`);
            queryParameters = { [String(randomStr1)]: firstValue, [String(randomStr2)]: secondValue };
            sqlOperator = not ? 'NOT BETWEEN' : 'BETWEEN';
            break;

          // IS NULL / NOT MULL
          case 'nch':
            sqlOperator = not ? 'IS NOT' : 'IS';
            break;

          default:
            break;
        }

        if (Object.keys(queryParameters).length == 0) {
          queryParameters = { [String(randomStr1)]: value };
        }

        if (operator === 'nullcheck') {
          queryWhere = `${whatToFilter} ${sqlOperator} NULL`;
        } else {
          queryWhere = `${whatToFilter} ${sqlOperator} ` + queryParameterName;
        }

        queryBuilder.andWhere(queryWhere, queryParameters);
      }
    },
  };
};

export class RequestQueryParser {
  public limit: number | undefined;
  public page: number | undefined;
  public sortByDesc: any;
  public sortByAsc: any;
  public relations: any;
  public filter: any;
  public filterByOr: any;
  public scopes: any;

  parseLimit(): number {
    return Number(this.limit);
  }

  getPage(): number {
    return Number(this.page);
  }

  parseSort(): object {
    if (isEmpty(this.sortByDesc) && isEmpty(this.sortByAsc)) {
      return [];
    }

    const list: any = {};

    if (!isEmpty(this.sortByDesc)) {
      const sortByDesc = this.sortByDesc.split(',');

      sortByDesc.forEach((field: string) => {
        list[field] = 'DESC';
      });
    }

    if (!isEmpty(this.sortByAsc)) {
      const sortByAsc = this.sortByAsc.split(',');

      sortByAsc.forEach((field: string) => {
        list[field] = 'ASC';
      });
    }

    return list;
  }

  parseRelations(): string[] {
    if (isEmpty(this.relations) && isEmpty(this.relations)) {
      return [];
    }

    return this.relations.split(',');
  }

  parseFilters(or: boolean = false): object[] {
    const filters = or ? this.filterByOr : this.filter;

    const parsedFilters: any = [];

    for (const filter in filters) {
      const myObj = filters[filter];
      let value: any = null;
      let operator: string = 'eq';
      let not: boolean = false;

      if (typeof myObj === 'string' || myObj instanceof String) {
        value = myObj;
      }

      if (typeof myObj === 'object') {
        operator = Object.keys(myObj)[0];
        value = myObj[operator];
        if (typeof value === 'string' || value instanceof String) {
          value = value;
        } else {
          operator = Object.keys(myObj)[0];
          const operatorValues = myObj[operator];
          const isNot = Object.keys(operatorValues)[0];
          not = Boolean(isNot);
          value = operatorValues[isNot];
        }
      }

      parsedFilters.push({ column: filter, operator: operator, not: not, value: value });
    }

    return parsedFilters;
  }

  parseFiltersByOr(): object[] {
    return this.parseFilters(true);
  }

  parseScopes(): object[] {
    if (isEmpty(this.scopes)) {
      return [];
    }

    return this.scopes;
  }

  getAll(): {
    take: number;
    skip: number;
    order: object;
    relations: string[];
    filters: object[];
    filtersByOr: object[];
    scopes: object[];
  } {
    return {
      take: this.parseLimit(),
      skip: (this.getPage() - 1) * this.parseLimit(),
      order: this.parseSort(),
      relations: this.parseRelations(),
      filters: this.parseFilters(),
      filtersByOr: this.parseFiltersByOr(),
      scopes: this.parseScopes(),
    };
  }
}
