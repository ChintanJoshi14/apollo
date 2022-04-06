import React from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

//initializing ApolloClient:

const client = new ApolloClient({
  //graphql server URL:
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  //cache, used to cache the query results after fetching them:
  cache: new InMemoryCache(),
});

// We want 1 USD is equal to how many in other currency
// example: 3.67 AED = 1 USD
// we use gql function here to parse query strings into query document

client
  .query({
    query: gql`
      query GetRates {
        rates(currency: "USD") {
          currency
        }
      }
    `,
  })
  .then((result) => console.log(result));
// --------------------------------------------------
//^^^^ till this point we are executing GraphQl operations directly without any
// view layer like React, which is usefull but Apollo client works better when
// integrated with A view layer. We can bind the queries to the UI, and the UI will
// be updated automatically as new data is fetched.

// function App() {
//   return (
//
//   );
// }

// VVV to connect apollo client to react, we wrap the App component within ApolloProvider component.
// ApolloProvider places Apollo client on the context, which allows us to access it from anywhere
// in our component tree. Once done, we can start fetching data with the hook
// useQuery() which will share the graphql data with the UI

//defining query, this query will be passed to useQuery() hook
const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

//function that will execute the GetExchangeRates query:
function ExchangeRates() {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading....</p>;
  if (error) return <p>Error :(</p>;

  return data.rates.map(({ currency, rate }) => (
    <div key={currency}>
      <p>{rate + " " + currency + " = 1 USD"}</p>
    </div>
  ));
}
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

reportWebVitals();

export default ExchangeRates;
