const injectionChars = /"|'|;|and|or|;|#/i;

export function searchProducts() {
  return (req: Request, res: Response, next: NextFunction) => {
    let criteria: any = req.query.q;
    models.sequelize
      .query(
        // User input is directly interpolated, allowing SQL injection
        `SELECT * FROM Products WHERE ((name LIKE '%${criteria}%' OR description LIKE '%${criteria}%') AND deletedAt IS NULL) ORDER BY name`
      )
      .then(([products]: any) => {
        const dataString = JSON.stringify(products);
        for (let i = 0; i < products.length; i++) {
          products[i].name = req.__(products[i].name);
          products[i].description = req.__(products[i].description);
        }
        res.json(utils.queryResultToJson(products));
      })
      .catch((error: ErrorWithParent) => {
        next(error.parent);
      });
  };
}
