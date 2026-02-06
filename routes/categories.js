var express = require('express');
var router = express.Router();
var slugify = require('slugify');

var categories = require('../utils/dataCategories').data;
var products = require('../utils/data').data;
var { IncrementalId } = require('../utils/IncrementalIdHandler');


/* =====================================================
   1. GET ALL (query theo name)
   GET /api/v1/categories?name=cloth
===================================================== */
router.get('/', (req, res) => {

  let nameQ = (req.query.name || '').toLowerCase();

  let result = categories.filter(c =>
    !c.isDeleted &&
    c.name.toLowerCase().includes(nameQ)
  );

  res.json(result);
});


/* =====================================================
   2. GET PRODUCTS BY CATEGORY ID
   GET /api/v1/categories/7/products
   ⚠️ đặt TRƯỚC /:id
===================================================== */
router.get('/:id/products', (req, res) => {

  let id = parseInt(req.params.id);

  let result = products.filter(p =>
    !p.isDeleted &&
    p.category.id === id
  );

  res.json(result);
});


/* =====================================================
   3. GET BY ID
   GET /api/v1/categories/7
===================================================== */
router.get('/:id', (req, res) => {

  let result = categories.find(c =>
    !c.isDeleted && c.id == req.params.id
  );

  if (!result)
    return res.status(404).json({ message: "CATEGORY NOT FOUND" });

  res.json(result);
});


/* =====================================================
   4. GET BY SLUG
   GET /api/v1/categories/slug/clothes
===================================================== */
router.get('/slug/:slug', (req, res) => {

  let result = categories.find(c =>
    !c.isDeleted && c.slug === req.params.slug
  );

  if (!result)
    return res.status(404).json({ message: "SLUG NOT FOUND" });

  res.json(result);
});


/* =====================================================
   5. CREATE
   POST /api/v1/categories
===================================================== */
router.post('/', (req, res) => {

  let newObj = {
    id: IncrementalId(categories),
    name: req.body.name,
    slug: slugify(req.body.name, { lower: true }),
    image: req.body.image || '',
    creationAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false
  };

  categories.push(newObj);

  res.status(201).json(newObj);
});


/* =====================================================
   6. EDIT
   PUT /api/v1/categories/7
===================================================== */
router.put('/:id', (req, res) => {

  let result = categories.find(c => c.id == req.params.id);

  if (!result)
    return res.status(404).json({ message: "CATEGORY NOT FOUND" });

  Object.assign(result, req.body);
  result.updatedAt = new Date();

  res.json(result);
});


/* =====================================================
   7. DELETE (soft delete)
   DELETE /api/v1/categories/7
===================================================== */
router.delete('/:id', (req, res) => {

  let result = categories.find(c => c.id == req.params.id);

  if (!result)
    return res.status(404).json({ message: "CATEGORY NOT FOUND" });

  result.isDeleted = true;

  res.json({ message: "DELETED SUCCESSFULLY" });
});


module.exports = router;
