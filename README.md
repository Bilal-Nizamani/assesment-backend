I've deliberately provided the .env file for a project that involves five routes—two for fetching data and three for posting data.

GET /api/cards: This route is designed for fetching cards dynamically from an open-source API. No authentication is required for this operation.

GET /user/data: This route is specifically designed for authenticated users. It fetches cards from the database that the user has purchased.

POST /register: This route is responsible for user registration, utilizing Passport JWT for authentication.

POST /login: This route handles user authentication. Upon successful authentication, it sends a bearer token in response to the frontend.

POST /payment-checkout: This route is for handling Stripe payments. After a successful payment, the card details are added to the database. Authentication is required for this operation.

This project aims to provide a seamless experience for users, allowing them to fetch cards from both open-source APIs and their purchased collection. The registration and login routes ensure secure access to user-specific data, and the payment checkout route facilitates secure and authenticated transactions using Stripe.
