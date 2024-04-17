/**
 * @openapi
 * servers:
 *  - url: https://api.example.com/v1
 * /api/register:
 *  post:
 *   tags:
 *    - User
 *   description: Registra un usuario
 *   responses:
 *    200:
 *     description: Devuelve JSON
 */

/**
 * @openapi
 * /api/login:
 *  post:
 *   tags:
 *    - User
 *   description: Login de usuario
 *   responses:
 *    200:
 *     description: Devuelve JSON
 */

/**
 * @openapi
 * /api/get-user:
 *  get:
 *   tags:
 *    - User
 *   description: Devuelve ID, email y nombre de usuario
 *   responses:
 *    200:
 *     description: Devuelve JSON
 */

/**
 * @openapi
 * /api/get-user:userId:
 *  get:
 *   tags:
 *    - User
 *   description: Devuelve ID, email y nombre de usuario
 *   responses:
 *    200:
 *     description: Devuelve JSON
 */

/**
 * @openapi
 * /api/user/favorite/:advertId:
 *  post:
 *   tags:
 *    - User
 *   description: Agrega el ID de un anuncio al array favoritos de un usuario
 *   responses:
 *    200:
 *     description: Devuelve status 200
 */

/**
 * @openapi
 * /api/deleteuser:
 *  post:
 *   tags:
 *    - User
 *   description: Elimina un usuario
 *   responses:
 *    200:
 *     description: Devuelve status 200
 */

/**
 * @openapi
 * /api/passwordupdate:
 *  post:
 *   tags:
 *    - User
 *   description: Actualiza la contrase;a de un usuario
 *   responses:
 *    200:
 *     description: Devuelve status 200
 */

/**
 * @openapi
 * /api/passwordresetrequest:
 *  post:
 *   tags:
 *    - User
 *   description: Solicita actualizar la contrase;a de un usuario
 *   responses:
 *    200:
 *     description: Devuelve status 200
 */

/**
 * @openapi
 * /api/passwordreset/:token:
 *  post:
 *   tags:
 *    - User
 *   description: Actualiza la contrase;a de un usuario
 *   responses:
 *    200:
 *     description: Devuelve status 200
 */

/**
 * @openapi
 * /api/adverts:
 *  get:
 *   tags:
 *    - Adverts
 *   description: Obtiene todos los anuncios
 *   responses:
 *    200:
 *     description: Devuelve un JSON
 */

/**
 * @openapi
 * /api/adverts-user:
 *  get:
 *   tags:
 *    - Adverts
 *   description: Obtiene los anuncios de un usuario
 *   responses:
 *    200:
 *     description: Devuelve un JSON
 */

/**
 * @openapi
 * /api/advert/id/:id:
 *  get:
 *   tags:
 *    - Adverts
 *   description: Obtiene la informacion de un anuncio
 *   responses:
 *    200:
 *     description: Devuelve un JSON
 */

/**
 * @openapi
 * /api/advert/new:
 *  post:
 *   tags:
 *    - Adverts
 *   description: Crea un anuncio
 *   responses:
 *    200:
 *     description: Devuelve un JSON
 */

/**
 * @openapi
 * /api/advert/:id:
 *  delete:
 *   tags:
 *    - Adverts
 *   description: Elimina un anuncio
 *   responses:
 *    200:
 *     description: Devuelve un JSON
 */

/**
 * @openapi
 * /api/advert/:id:
 *  put:
 *   tags:
 *    - Adverts
 *   description: Actualiza un anuncio
 *   responses:
 *    200:
 *     description: Devuelve un JSON
 */

/**
 * @openapi
 * /api/contactvendor:
 *  post:
 *   tags:
 *    - Email
 *   description: Envia un email al due;o del anuncio
 *   responses:
 *    200:
 *     description: Devuelve un JSON
 */

/**
 * @openapi
 * /api/tags:
 *  get:
 *   tags:
 *    - Tags
 *   description: Obtiene todas las tags
 *   responses:
 *    200:
 *     description: Devuelve un JSON
 */
