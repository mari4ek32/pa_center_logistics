const { checkAuth } = require('../../lib/index')
const { paginate } = require('../../lib/paginate')

module.exports = (app, client) => {
  app.get(
    '/products_list',
    checkAuth(),
    function (req, res) {
      client.query(`SELECT 
            t."ид7" AS id,
            t."Код" AS barcode,
            t."Наименование" AS name, 
            t."Артикул" AS vendor_code, 
            t."Характеристика" AS size, 
            e."ид7" AS "product_detail_id", 
            e."Наименование" AS "product_detail_name"
          FROM 
            db."Товары" t, 
            db."ЕдиницыТМЦ" e
          WHERE 
            t."БазоваяЕд" = e."ид7" AND
            t."Владелец" = '${req.user.customer_id}' AND 
            NOT t._del
          ORDER BY t."Наименование", t."ид7"
            ;`)
        .then(result => {
          paginate(result, req, res)
        })
        .catch(e => console.error(e.stack))
    }
  )
}
