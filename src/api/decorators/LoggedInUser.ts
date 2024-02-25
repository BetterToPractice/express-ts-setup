import { createParamDecorator } from 'routing-controllers';

export function LoggedInUser() {
  return createParamDecorator({
    value: (action) => {
      return action.request.loggedUser;
    },
  });
}
