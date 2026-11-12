const {User, Profile, Product, Category, Cart} = require("../models")
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize');
const {rupiah, generateInvoice} = require('../helpers/helper')
const easyinvoice = require('easyinvoice');

class Controller {
    // LANDING PAGE, REGISTER, LOGIN
    static async landingPage(req, res) {
      try {
        res.render("landingpage")
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async getRegister(req, res) {
      try { const {error} = req.query
        res.render("register-form", {error})
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async postGetRegister(req, res) {
      try {
        const {email, password, role} =  req.body
        await User.create({email, password, role})
        res.redirect("/login")
      } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeValidationError') {
          const errors = error.errors.map(el => el.message).join(', ');
          return res.redirect(`/register?error=${errors}`);
        }
        res.send(error);
      }
    }
  
    static async getLogin(req, res) {
      try {
        const {error} = req.query
        res.render("login-form", {error})
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async postGetLogin(req, res) {
      try {
        const {email, password} = req.body
        let user = await User.findOne({
            where : {
                email
            }
        })
        if (user) {
            const isValidPassword = bcrypt.compareSync(password, user.password)

            if (isValidPassword) {
                req.session.userId = user.id 
                req.session.role = user.role
                return res.redirect('/products')
            } else {
                const error = "Invalid Email/Password"
                return res.redirect(`/login?error=${error}`)
            }
        } else {
            const error = "Invalid Email/Password"
            return res.redirect(`/login?error=${error}`)
        }

      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async handleLogout(req, res) {
      try {
        req.session.destroy((err) => {
            if (err) res.send(err)
            else {
                res.redirect('/login')
            }
        })
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }

    static async renderAddProfile(req, res) {
      try {
        const { error } = req.query;
        const userId = req.session.userId;
        const profile = await Profile.findOne({ where: { userId } });
  
        res.render('addProfile', {
          profile,
          error: error || null
        });
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }

    static async showProfile(req, res) {
      try {
        const userId = req.session.userId;
        const { success, error } = req.query;
  
        const user = await User.findByPk(userId, {
          include: [Profile]
        });
  
        res.render('profiles', {
          user,
          profile: user.Profile,
          success: success || null,
          error
        });
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }

    static async postAddProfile(req, res) {
      try {
        const userId = req.session.userId;
        const { fullName, phoneNumber, address } = req.body;
  
        const existingProfile = await Profile.findOne({ where: { userId } });
  
        if (existingProfile) {
          await existingProfile.update({ fullName, phoneNumber, address });
        } else {
          await Profile.create({ userId, fullName, phoneNumber, address });
        }
        res.redirect('/carts');
      } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeValidationError') {
          const errors = error.errors.map(el => el.message).join(', ');
          return res.redirect(`/profiles/add?error=${errors}`);
        }
        res.send(error);
      }
    }
  
    // PRODUCTS

    static async productIndex(req, res) {
      try {
        const { search, categoryId, error } = req.query;
        let opt = {
          include: Category, 
          order: [['createdAt', 'DESC']],
          where : {}
        }

        if (search) {
            opt.where.name = {
                [Op.iLike]: `%${search}%`
            }
        } 
         let products = await Product.findAll(opt)
        if (categoryId) {
          products = products.filter(product => product.categoryId === Number(categoryId));
        }
          const category = await Category.findAll();
  
        res.render('products', {
          products,
          category,
          session: req.session,
          error: error || null,
          currentSearch: search,
          currentCategory: categoryId,
          rupiah
        });
  
      } catch (error) {
        console.log(error);
        res.send(error)
      }
    }
  
    static async addProduct(req, res) {
      try {
        const { error } = req.query;
        const categories = await Category.findAll();
  
        res.render('addProduct', { 
          categories, 
          error: error || null 
        });
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async postAddProduct(req, res) {
      try {
        const { name, description, price, categoryId } = req.body;
        const userId = req.session.userId;
  
        await Product.create({
          name,
          description,
          price,
          categoryId,
          userId
        });
  
        res.redirect('/products');
      } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeValidationError') {
          const errors = error.errors.map(el => el.message).join(', ');
          return res.redirect(`/products/add?error=${errors}`);
        }
        res.send(error);
      }
    }
  
    static async productDetail(req, res) {
      try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
          include: [Category, User]
        });
  
        if (!product) {
          return res.redirect('/products?error=Produk tidak ditemukan');
        }
  
        res.render('product-detail', {
          product,
          session: req.session,
          rupiah
        });
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async editProduct(req, res) {
      try {
        const { id } = req.params;
        const { error } = req.query;
  
        const product = await Product.findByPk(id);
        const categories = await Category.findAll();
  
        if (!product) {
          return res.redirect('/products?error=Produk tidak ditemukan');
        }
  
        res.render('edit-product', {
          product,
          categories,
          error: error || null
        });
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async postEditProduct(req, res) {
      try {
        const { id } = req.params;
        const { name, description, price, categoryId } = req.body;
        let data = await Product.findByPk(id)
        await data.update({ 
          name, 
          description, 
          price, 
          categoryId 
        });
  
        res.redirect('/products');
      } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeValidationError') {
          const errors = error.errors.map(el => el.message).join(', ');
          return res.redirect(`/products/${req.params.id}/edit?error=${errors}`);
        }
        res.send(error);
      }
    }
  
    static async deleteProduct(req, res) {
      try {
        const { id } = req.params;
        let data = await Product.findByPk(id)
        data.destroy()
        res.redirect('/products');
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    // CARTS

    static async cartIndex(req, res) {
      try {
        const userId = req.session.userId;
        const carts = await Cart.getUserCarts(userId);
        res.render('cart-index', {
          carts,
          rupiah
        });
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async getCheckout(req, res) {
      try {
        const userId = req.session.userId;
  
        const carts = await Cart.getUserCarts(userId);
        if (carts.length === 0) {
          return res.redirect('/carts');
        }
  
        const user = await User.findByPk(userId, {
          include: [Profile]
        });
  
        if (!user.Profile) {
          return res.redirect('/profiles?error=Silakan lengkapi data diri dan alamat pengiriman terlebih dahulu sebelum checkout.');
        }
  
        res.render('checkout', {
          carts,
          user,
          rupiah
        });
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async postGetCheckout(req, res) {
      try {
        const userId = req.session.userId;
  
        const carts = await Cart.getUserCarts(userId);
        if (carts.length === 0) {
          return res.redirect('/carts');
        }
  
        const user = await User.findByPk(userId, {
          include: [Profile]
        });
  
        if (!user.Profile) {
          return res.redirect('/profiles/add?error=Silakan lengkapi profil sebelum checkout.');
        }
        const { pdfBuffer, invoiceNumber } = await generateInvoice(user, carts);
        await Cart.destroy({
          where: { userId }
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
        res.send(pdfBuffer);
  
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }


  
    static async addToCart(req, res) {
      try {
        const userId = req.session.userId;
        const { productId } = req.params;
        const quantity = Number(req.body.quantity) || 1;

        const existingCartItem = await Cart.findOne({
          where: { userId, productId }
        });
  
        if (existingCartItem) {
          existingCartItem.quantity += quantity;
          await existingCartItem.save();
        } else {
          await Cart.create({
            userId,
            productId,
            quantity
          });
        }
        res.redirect('/carts');
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  
    static async deleteCartItem(req, res) {
      try {
        const userId = req.session.userId;
        const { productId } = req.params;
        await Cart.destroy({
          where: {
            userId,
            productId
          }
        });
        res.redirect('/carts');
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  }
  
  module.exports = Controller;