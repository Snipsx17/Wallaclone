
# Wallaclone API

API Rest developed for the Wallaclone project


## Environment Variables

To start the project it is necessary to add the following environment variables in an .env file

`MONGODB_URI`

`EXPIRATION_TOKEN`

`JWT_SECRET`

`AWS_S3_BUCKET_NAME`

`AWS_ACCESS_KEY`

`AWS_ACCESS_SECRET`

`PATH_PRODUCT_IMAGE_PLACEHOLDER`

`PATH_PRODUCT_IMAGE_THUMBNAIL_PLACEHOLDER`

## Installation

For this project will be necesary to run MongoDB server
https://www.mongodb.com/

Also will be necesary an bucket S3 on AWS with the permisions for write, read and list

https://aws.amazon.com/en/s3/


#### Clone the project

```bash
  git clone https://github.com/Nobubledin/Wallaclone
```

#### Go to the project directory

```bash
  cd Wallaclone
```

#### Install dependencies

```bash
  npm i
```

#### Init Data Base

```bash
  npm run initDB
```
## Run Locally




Start development the server

```bash
  npm run dev
```

Start production the server

```bash
  npm start
```

## Used By

This project is used by the following Front-end project:

https://github.com/GrabyAprende/wallaclone-fe/


## 🔗 Create By
### Nobubledin
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/Nobubledin)

### Snipsx
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/Snipsx17)


## License

[MIT](https://choosealicense.com/licenses/mit/)

