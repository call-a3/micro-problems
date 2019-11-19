# micro-problems

[![NPM](https://img.shields.io/npm/v/micro-problems.svg)](https://www.npmjs.com/package/micro-problems)
[![Travis](https://img.shields.io/travis/call-a3/micro-problems.svg)](https://travis-ci.com/call-a3/micro-problems)
[![Codecov](https://img.shields.io/codecov/c/github/call-a3/micro-problems.svg)](https://codecov.io/gh/call-a3/micro-problems)
[![Greenkeeper badge](https://badges.greenkeeper.io/call-a3/micro-problems.svg)](https://greenkeeper.io/)
[![David](https://img.shields.io/david/call-a3/micro-problems.svg)](https://david-dm.org/call-a3/micro-problems)
[![David Dev](https://img.shields.io/david/dev/call-a3/micro-problems.svg)](https://david-dm.org/call-a3/micro-problems?type=dev)

A companion library to [micro](https://www.npmjs.com/package/micro) which helps in responding to requests with [`application/json+problem`](https://tools.ietf.org/html/rfc7807)

## Installing

```bash
# npm
npm install -s micro-problems

# yarn
yarn add micro-problems
```

## Usage

```js
// out-of-credit.js
import declareProblem from "micro-problems";

// First off, you want to declare the type of problem your application could encounter.
const { handler, Problem, decorator } = declareProblem({
  type: "https://example.com/api/probs/out-of-credit",
  status: 403,
  title: "You do not have enough credit.",
  detail:
    "Your current balance is lower than the cost of what you are trying to purchase."
});

export { handler, Problem, decorator };
```

In the rest of this example, I leave it up to the reader to pick their preferred method of routing requests.
Assume in this example that any file in the `api` folder would be routed as the corresponding route (minus the file extension).

```js
// api/probs/out-of-credit.js

import { handler } from "../../out-of-credit";

// If you are the one serving the URI connected to the problem, you can use `handler` to respond to it.
export default handler;
```

```js
// api/purchases.js

import {
  Problem as OutOfCreditProblem,
  decorator as withOutOfCreditProblem
} from "../out-of-credit";

// A handler which could encounter the problem, should use a combination of the Problem and decorator
export default withOutOfCreditProblem(async (req, res) => {
  const purchase = await json(req);
  const account = await determineAccount(req);
  if (account.credit < purchase.cost) {
    const notification = await account.addFailedPurchaseNotification(purchase)
    throw new OutOfCreditProblem(
      `Your current balance is ${account.credit}, but that costs ${purchase.cose}.`,
      {
        balance: account.credit,
        accounts: [account.uri, purchase.seller.uri]
      },
      notification.uri
    );
  }
});
```
