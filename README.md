# Book Store Application

🌟 Features

👤 User Experience

- Browse a rich catalog of books.

- Apply filters to quickly find titles of interest.

- View book ratings and manage purchases via an intuitive shopping cart and checkout flow.

📝 User Profiles

- Maintain personal profiles.

- Manage information and create a personalized list of favorite books.

📖 Book Interaction

- Rating system and comment section for each book.

- Add, edit, or remove your own comments.

- Admin moderation ensures appropriate content.

🛠️ Admin Content Management

- Add new books or import books via CSV.

- Edit existing book details or remove books entirely.

- Ratings and comments update dynamically in real time.

🔐 Role-Based Access Control

- Clear separation between regular users and administrators.

- Admins have access to all user data and permission settings.

- Ensures secure platform governance.

📊 Analytics for Administrators

- View store analytics for user behavior, book performance, and store activity.

- Inform decisions for content management and business growth.

## UI DEMO
<img width="1908" height="945" alt="home"
  src="https://github.com/user-attachments/assets/f02b3917-27b8-4407-b6a8-90c3c9678285"
  style="margin-bottom: 24px;" />

<img width="1899" height="956" alt="store filter"
  src="https://github.com/user-attachments/assets/75628ea1-1466-45a5-b3d6-cee7094f0874"
  style="margin-bottom: 24px;" />

<img width="1903" height="950" alt="book deatils"
  src="https://github.com/user-attachments/assets/9173888b-0463-477c-a577-eb9627b48b7f"
  style="margin-bottom: 24px;" />

<img width="1904" height="948" alt="cart"
  src="https://github.com/user-attachments/assets/d66dac1e-d1e8-406c-9209-aa81d814029b"
  style="margin-bottom: 24px;" />

<img width="1898" height="864" alt="admin modal 1"
  src="https://github.com/user-attachments/assets/1fefb96a-231a-42a0-9885-a767735f640e"
  style="margin-bottom: 24px;" />

<img width="1900" height="948" alt="admin modal 2"
  src="https://github.com/user-attachments/assets/5ee352ca-f433-4034-82d8-bcbd5fe873f2"
  style="margin-bottom: 24px;" />

<img width="1905" height="949" alt="profile"
  src="https://github.com/user-attachments/assets/951c1816-d6ab-4935-859d-548ee3c2cc0c"
  style="margin-bottom: 24px;" />

<img width="1907" height="955" alt="user list"
  src="https://github.com/user-attachments/assets/1f2f6619-3cc3-46ea-8a2d-8ef36fdd4399"
  style="margin-bottom: 24px;" />

<img width="1905" height="958" alt="analytics 1"
  src="https://github.com/user-attachments/assets/b7253a6c-4cb7-4fdb-b1da-d23750bc5240"
  style="margin-bottom: 24px;" />

<img width="1905" height="957" alt="analytics 2"
  src="https://github.com/user-attachments/assets/87baaa75-d28c-448a-9ac0-0ef32d9f129c"
  style="margin-bottom: 24px;" />

<img width="1906" height="949" alt="analytics 3"
  src="https://github.com/user-attachments/assets/43e12ee1-57f9-42bf-a462-dab03b84354f"
  style="margin-bottom: 24px;" />

<img width="1909" height="956" alt="analytics 4"
  src="https://github.com/user-attachments/assets/bdc03306-27c0-4e04-a2f9-317823f791d9"
  style="margin-bottom: 24px;" />

<img width="1905" height="954" alt="registration"
  src="https://github.com/user-attachments/assets/71819de4-cba3-4822-8e21-fbe5fb6711fc"
  style="margin-bottom: 24px;" />

<img width="1905" height="951" alt="sign in"
  src="https://github.com/user-attachments/assets/0e93653d-5af0-4ce1-bc09-ecadb35170a6"
  style="margin-bottom: 24px;" />

<img width="1904" height="949" alt="edit book"
  src="https://github.com/user-attachments/assets/3483bf48-2d53-4688-978f-727bf4bf205e"
  style="margin-bottom: 24px;" />

<img width="1908" height="951" alt="add new book"
  src="https://github.com/user-attachments/assets/68afa687-08f6-4f22-9e04-9fb1ef556736" />



## Server side
**Core**
- express `4.21.2`
- graphql `16.11.0`
- @apollo/server `5.0.0`
- mongodb `3.1.0-beta4`
- mongoose `8.18.1`

**Authentication**
- passport `0.4.0`
- passport-local `1.0.0`
- jsonwebtoken `8.3.0`

**GraphQL Tools**
- @graphql-tools/load-files `7.0.1`
- @graphql-tools/merge `9.1.1`
- graphql-tag `2.12.6`
- graphql-type-json `0.3.2`

**Utilities**
- cors `2.8.5`
- dotenv `17.2.2`
- body-parser `1.18.3`
- validator `10.4.0`
- nodemailer `7.0.12`
- googleapis `159.0.0`

**Dev & Tooling**
- eslint `9.34.0`
- prettier `3.6.2`
- eslint-config-prettier `10.1.8`
- eslint-plugin-prettier `5.5.4`
- @types/express
- @types/mongoose
- @types/mongodb

## Client side
**Core**
- react `18.3.1`
- react-dom `18.3.1`
- vite `5.2.1`
- @vitejs/plugin-react `4.3.0`
- typescript `5.4.5`

**UI**
- @chakra-ui/react `2.10.9`
- @chakra-ui/icons `2.2.4`
- framer-motion `11.2.6`
- react-icons `5.5.0`
- react-loading-skeleton `3.5.0`

**State & Data**
- @reduxjs/toolkit `2.2.7`
- react-redux `9.1.2`
- redux-persist `6.0.0`
- @apollo/client `4.0.6`
- axios `1.7.2`
- graphql `16.11.0`
- papaparse `5.5.3`

**Routing & Charts**
- react-router-dom `6.23.1`
- recharts `3.2.1`

**Dates**
- date-fns `3.6.0`

**Dev & Linting**
- eslint `8.57.1`
- prettier `3.3.0`
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- eslint-config-prettier
- @typescript-eslint/parser
- @typescript-eslint/eslint-plugin

