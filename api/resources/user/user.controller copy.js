const url = require('url');
const path = require('path');
const cloudinary = require('../../../config/cloudinary');
const bcriptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const UserModel = require('./user.model');
const { json } = require('body-parser');

module.exports = {
  async createUser(req, res) {
    try {
      let data = req.body;

      if (!data.name)
        return res.status(400).send({ error: 'Name is required' });
      if (!data.email)
        return res.status(400).send({ error: 'Email is required' });
      if (!data.phonenumber)
        return res.status(400).send({ error: 'Phone Number is required' });
      if (!data.password)
        return res.status(400).send({ error: 'Password is required' });

      const user = await UserModel.findOne({ email: data.email.toLowerCase() });

      if (user) return res.status(400).send({ error: 'Email already in use' });

      if (data.password.length < 6)
        return res.status(400).send('Password length too short');

      const name = data.name;
      const email = data.email.toLowerCase();
      const phonenumber = data.phonenumber;
      const password = data.password;

      if (process.env.NODE_ENV === 'development') {
        var newUser = new UserModel();
        newUser.name = name;
        newUser.email = email;
        newUser.phonenumber = phonenumber;

        //HASHING THE password with bcryptjs
        const salt = await bcriptjs.genSalt(10);
        const hashedPassword = await bcriptjs.hash(password, salt);
        newUser.password = hashedPassword;

        await newUser.save((err, docs) => {
          if (!err) {
            return res.status(201).send({ success: 'Account created' });
          } else {
            return res.status(400).send({ error: `${err}` });
          }
        });
      } else {
        const token = await jwt.sign(
          { name, email, phonenumber, password },
          process.env.JWT_ACC_ACTIVATE,
          { expiresIn: '20m' }
        );

        const resetUrl = `${req.protocol}://${req.get(
          'host'
        )}/api/v1/users/activate/${token}`;

        const message = `You are creating an account with us with this email,
                        please click this link ${resetUrl} to complete the reset process or ignore this if you didnt order it`;

        try {
          await emailPassword({
            email: email,
            subject: 'Verify Email Address',
            //message,
            html: `
                            <!DOCTYPE html>
                            <html>
                            
                            <head>
                            <title></title>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <style type="text/css">
                                /* FONTS */
                                @import url('https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i');
                            
                                /* CLIENT-SPECIFIC STYLES */
                                body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                                table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                                img { -ms-interpolation-mode: bicubic; }
                            
                                /* RESET STYLES */
                                img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                                table { border-collapse: collapse !important; }
                                body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
                            
                                /* iOS BLUE LINKS */
                                a[x-apple-data-detectors] {
                                    color: inherit !important;
                                    text-decoration: none !important;
                                    font-size: inherit !important;
                                    font-family: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                }
                            
                                /* MOBILE STYLES */
                                @media screen and (max-width:600px){
                                    h1 {
                                        font-size: 32px !important;
                                        line-height: 32px !important;
                                    }
                                }
                            
                                /* ANDROID CENTER FIX */
                                div[style*="margin: 16px 0;"] { margin: 0 !important; }
                            </style>
                            </head>
                            <body style="background-color: #f3f5f7; margin: 0 !important; padding: 0 !important;">
                            
                            <!-- HIDDEN PREHEADER TEXT -->
                            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Poppins', sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                                We're thrilled to have you here! Get ready to dive into your new account.
                            </div>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- LOGO -->
                                <tr>
                                    <td align="center">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                                        <tr>
                                        <td align="center" valign="top" width="600">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td align="center" valign="top" style="padding: 40px 10px 10px 10px;">
                                                    <a href="#" target="_blank" style="text-decoration: none;">
                            \t\t\t\t\t\t\t<span style="display: block; font-family: 'Poppins', sans-serif; color: #3e8ef7; font-size: 36px;" border="0"><b>${process.env.EMAIL_FROM}</b></span>
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <!-- HERO -->
                                <tr>
                                    <td align="center" style="padding: 0px 10px 0px 10px;">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                                        <tr>
                                        <td align="center" valign="top" width="600">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Poppins', sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 2px; line-height: 48px;">
                                                  <h1 style="font-size: 36px; font-weight: 600; margin: 0;">Hi! ${name}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <!-- COPY BLOCK -->
                                <tr>
                                    <td align="center" style="padding: 0px 10px 0px 10px;">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                                        <tr>
                                        <td align="center" valign="top" width="600">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                          <!-- COPY -->
                                          <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                                              <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                                            </td>
                                          </tr>
                                          <!-- BULLETPROOF BUTTON -->
                                          <tr>
                                            <td bgcolor="#ffffff" align="left">
                                              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                  <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 30px 30px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                      <tr>
                                                          <td align="center" style="border-radius: 3px;" bgcolor="#17b3a3"><a href="${resetUrl}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 12px 50px; border-radius: 2px; border: 1px solid #17b3a3; display: inline-block;">Confirm Account</a></td>
                                                      </tr>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                          <!-- COPY -->
                                          <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: &apos;Lato&apos;, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                                              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                            </td>
                                          </tr>
                                          <!-- COPY -->
                                            <tr>
                                              <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: &apos;Lato&apos;, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;"><a href="${resetUrl}" target="_blank" style="color: #17b3a3;">${resetUrl}</a></p>
                                              </td>
                                            </tr>
                                          <!-- COPY -->
                                          <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: &apos;Lato&apos;, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                                              <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                            </td>
                                          </tr>
                                          <!-- COPY -->
                                          <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 0px 0px; color: #666666; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 400; line-height: 25px;">
                                              <p style="margin: 0;">Cheers,<br>Team</p>
                                            </td>
                                          </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            </body>
                            
                            </html>
                            `
          });

          return res.status(201).send({
            success: `A verification mail has been sent to you via ${email}`
          });
        } catch (error) {
          return res.status(400).send({ error: 'Email could not be sent' });
        }
      }
    } catch (err) {
      res.status(400).send({ error: err });
    }
  },

  async updateUser(req, res) {
    try {
      const user = await UserModel.findOne({ _id: req.params.id });

      if (!user) return res.status(404).send({ error: 'User not found' });

      var data = req.body;

      if (!data.name && !data.phonenumber && !data.address && !data.passwords)
        return res.status(400).send({ error: 'Nothing to update' });

      if (data.name) {
        user.name = data.name;
      }

      if (data.phonenumber) {
        user.phonenumber = data.phonenumber;
      }

      if (data.ssn) {
        user.ssn = data.ssn;
      }

      await user.save({ _id: req.params.id }, (err, docs) => {
        if (!err) {
          res.status(200).send({ success: 'user updated' });
        } else {
          res.status(400).send({ error: err });
        }
      });
    } catch (err) {
      res.status(400).send({ error: err });
    }
  },

  async updateProfilePics(req, res) {
    try {
      const user = await UserModel.findOne({ _id: req.params.id });

      if (!user) return res.status(404).send({ error: 'User not found' });

      var data = req.body;

      if (!data.photo && !data.idCard)
        return res.status(400).send({ error: 'Specify file to update' });

      if (data.photo) user.photo = data.photo;
      if (data.idCard) user.idCard = data.idCard;

      await user.save({ _id: req.params.id }, (err, docs) => {
        if (!err) {
          res.status(200).send({ success: 'Image updated' });
        } else {
          res.status(400).send({ error: err });
        }
      });
    } catch (err) {
      res.status(400).send({ error: err });
    }
  },

  async getSingleUser(req, res) {
    try {
      UserModel.findOne({ _id: req.params.id }, (err, doc) => {
        if (!err) {
          if (!doc) return res.status(404).send({ error: 'User not found' });

          res.status(200).send(doc);
        } else {
          res.status(400).send({ error: err });
        }
      });
    } catch (err) {
      res.status(400).send({ error: err });
    }
  },

  async getAllUsers(req, res) {
    try {
      const level = req.query.level;
      if (level) {
        UserModel.find({ level: level }, (err, docs) => {
          if (!err) {
            return res.status(200).send(docs);
          } else {
            return res.status(400).send({ error: err });
          }
        });
      } else {
        UserModel.find((err, docs) => {
          if (!err) {
            return res.status(200).send(docs);
          } else {
            return res.status(400).send({ error: err });
          }
        });
      }
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async findAllUsersPaginate(req, res) {
    try {
      const { page, perPage, sort, level } = req.query;
      const options = {};
      if (level) {
        options = {
          page: parseInt(page, 10) || 1,
          limit: parseInt(perPage, 10) || 10,
          level: level,
          sort: { date: -1 }
        };
      } else {
        options = {
          page: parseInt(page, 10) || 1,
          limit: parseInt(perPage, 10) || 10,
          sort: { date: -1 }
        };
      }

      await UserModel.paginate({}, options, (err, docs) => {
        if (!err) {
          if (docs) return res.status(200).send(docs);
        } else {
          return res.status(400).send({ error: err });
        }
      });
    } catch (e) {
      return res.status(400).send({ error: e });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await UserModel.findOne({ _id: req.params.id });
      if (!user) return res.status(200).send({ error: 'user not found' });

      try {
        user.remove((err, docs) => {
          if (!err) {
            if (doc.image) {
              destroy(nameFromUri(doc.image)).catch((result) => {
                console.log(result);
              });
            }

            return res.status(200).send({ success: 'user deleted' });
          } else {
            return res.status(400).send({ error: err });
          }
        });
      } catch (err) {
        return res.status(400).send({ error: err });
      }
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async loginUser(req, res) {
    try {
      let data = req.body;

      const email = data.email.toLowerCase();

      if (!email) return res.status(400).send({ error: 'Email is required' });

      if (!data.password)
        return res.status(400).send({ error: 'Password is required' });

      const user = await UserModel.findOne({ email: email });

      if (!user)
        return res.status(400).send({ error: `Email or Password incorrect` });

      const password = await bcriptjs.compare(data.password, user.password);

      if (!password)
        return res.status(400).send({ error: `Email or Password incorrect` });

      sendTokenResponse(user, 200, res);
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async updatePassword(req, res) {
    try {
      let data = req.body;
      const id = req.params.id;

      if (!data.oldPassword)
        return res.status(400).send({ error: 'Old Password is required' });

      if (!data.password)
        return res.status(400).send({ error: 'New Password is required' });

      const user = await UserModel.findOne({ _id: id });
      if (!user) return res.status(400).send({ error: `User does not exist` });

      const password = await bcriptjs.compare(data.oldPassword, user.password);

      if (!password)
        return res.status(400).send({ error: `The old password is incorrect` });

      const salt = await bcriptjs.genSalt(10);
      const hashedPassword = await bcriptjs.hash(data.password, salt);
      user.password = hashedPassword;
      await user.save({ _id: req.params.id }, (err, docs) => {
        if (!err) {
          res.status(200).send({ success: 'Password updated' });
        } else {
          res.status(400).send({ err: err });
        }
      });
    } catch (err) {
      return res.status(400).send({ err: err });
    }
  },

  async logoutUser(req, res, next) {
    res.cookie('token', 'none', {
      expiresIn: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).send({ success: 'Logout Success' });
  },

  async forgotPassword(req, res) {
    try {
      const user = await UserModel.findOne({
        email: req.body.email.toLowerCase()
      });

      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      const resetToken = user.getResetPasswordToken();

      user.save({ validateBeforeSave: false });

      const resetUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetpassword/${resetToken}`;

      const message = `You are receiving this email because you have requested to reset your password,
             please click this link ${resetUrl} to complete the reset process or ignore this if you didnt order it`;

      try {
        await emailPassword({
          email: user.email,
          subject: 'Password Reset',
          html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>Password Reset</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
      @media screen {
        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 400;
          src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'),
            url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff)
              format('woff');
        }

        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 700;
          src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'),
            url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff)
              format('woff');
        }
      }

      /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
      body,
      table,
      td,
      a {
        -ms-text-size-adjust: 100%; /* 1 */
        -webkit-text-size-adjust: 100%; /* 2 */
      }

      /**
   * Remove extra space added to tables and cells in Outlook.
   */
      table,
      td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
      }

      /**
   * Better fluid images in Internet Explorer.
   */
      img {
        -ms-interpolation-mode: bicubic;
      }

      /**
   * Remove blue links for iOS devices.
   */
      a[x-apple-data-detectors] {
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        text-decoration: none !important;
      }

      /**
   * Fix centering issues in Android 4.4.
   */
      div[style*='margin: 16px 0;'] {
        margin: 0 !important;
      }

      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      /**
   * Collapse table borders to avoid space between cells.
   */
      table {
        border-collapse: collapse !important;
      }

      a {
        color: #1a82e2;
      }

      img {
        height: auto;
        line-height: 100%;
        text-decoration: none;
        border: 0;
        outline: none;
      }
    </style>
  </head>
  <body style="background-color: #e9ecef">
    <!-- start preheader -->
    <div
      class="preheader"
      style="
        display: none;
        max-width: 0;
        max-height: 0;
        overflow: hidden;
        font-size: 1px;
        line-height: 1px;
        color: #fff;
        opacity: 0;
      "
    >
      A preheader is the short summary text that follows the subject line when
      an email is viewed in the inbox.
    </div>
    <!-- end preheader -->

    <!-- start body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <!-- start logo -->
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px"
          >
            <tr>
              <td align="center" valign="top" style="padding: 36px 24px">
                <a
                  href="https://sendgrid.com"
                  target="_blank"
                  style="display: inline-block"
                >
                  <img
                    src="./img/paste-logo-light@2x.png"
                    alt="Logo"
                    border="0"
                    width="48"
                    style="
                      display: block;
                      width: 48px;
                      max-width: 48px;
                      min-width: 48px;
                    "
                  />
                </a>
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
        </td>
      </tr>
      <!-- end logo -->

      <!-- start hero -->
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px"
          >
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="
                  padding: 36px 24px 0;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  border-top: 3px solid #d4dadf;
                "
              >
                <h1
                  style="
                    margin: 0;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: -1px;
                    line-height: 48px;
                  "
                >
                  Reset Your Password
                </h1>
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
        </td>
      </tr>
      <!-- end hero -->

      <!-- start copy block -->
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px"
          >
            <!-- start copy -->
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="
                  padding: 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 24px;
                "
              >
                <p style="margin: 0">
                  Tap the button below to reset your customer account password.
                  If you didn't request a new password, you can safely delete
                  this email.
                </p>
              </td>
            </tr>
            <!-- end copy -->

            <!-- start button -->
            <tr>
              <td align="left" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 12px">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td
                            align="center"
                            bgcolor="#1a82e2"
                            style="border-radius: 6px"
                          >
                            <a
                              href="${resetUrl}"
                              target="_blank"
                              style="
                                display: inline-block;
                                padding: 16px 36px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 6px;
                              "
                              >Reset Password</a
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- end button -->

            <!-- start copy -->
            <tr>
              <td
                align="left"
        jj        bgcolor="#ffffff"
                style="
                  padding: 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 24px;
                "
              >
                <p style="margin: 0">
                  If that doesn't work, copy and paste the following link in
                  your browser:
                </p>
                <p style="margin: 0">
                  <a href="${resetUrl}" target="_blank"
                    >${resetUrl}</a
                  >
                </p>
              </td>
            </tr>
            <!-- end copy -->

            <!-- start copy -->
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="
                  padding: 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 24px;
                  border-bottom: 3px solid #d4dadf;
                "
              >
                <p style="margin: 0">
                  Cheers,<br />
                  Paste
                </p>
              </td>
            </tr>
            <!-- end copy -->
          </table>
          <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
        </td>
      </tr>
      <!-- end copy block -->

      <!-- start footer -->
      <tr>
        <td align="center" bgcolor="#e9ecef" style="padding: 24px">
          <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px"
          >
            <!-- start permission -->
            <tr>
              <td
                align="center"
                bgcolor="#e9ecef"
                style="
                  padding: 12px 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 14px;
                  line-height: 20px;
                  color: #666;
                "
              >
                <p style="margin: 0">
                  You received this email because we received a request for
                  [type_of_action] for your account. If you didn't request
                  [type_of_action] you can safely delete this email.
                </p>
              </td>
            </tr>
            <!-- end permission -->

            <!-- start unsubscribe -->
            <tr>
              <td
                align="center"
                bgcolor="#e9ecef"
                style="
                  padding: 12px 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 14px;
                  line-height: 20px;
                  color: #666;
                "
              >
                <p style="margin: 0">
                  To stop receiving these emails, you can
                  <a href="https://sendgrid.com" target="_blank">unsubscribe</a>
                  at any time.
                </p>
                <p style="margin: 0">
                  Paste 1234 S. Broadway St. City, State 12345
                </p>
              </td>
            </tr>
            <!-- end unsubscribe -->
          </table>
          <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
        </td>
      </tr>
      <!-- end footer -->
    </table>
    <!-- end body -->
  </body>
</html>
`
        });

        return res.status(200).send({ success: 'Email sent' });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPassordExpire = undefined;

        user.save({ validateBeforeSave: false });

        return res.status(400).send({ error: error });
      }
    } catch (err) {
      res.status(400).send({ error: err });
    }
  },

  async getMe(req, res, next) {
    const user = await UserModel.findById(req.user.id);

    res.status(200).send(user);
  },

  async resetPassword(req, res) {
    //HASHING THE password with bcryptjs
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send({ error: 'Expired or Invaild link' });
    }

    //HASHING THE password with bcryptjs
    const salt = await bcriptjs.genSalt(10);
    const hashedPassword = await bcriptjs.hash('default', salt); //req.body.password

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPassordExpire = undefined;

    await user.save();

    return res.status(200).render('pages/newpassword', {});
  },

  async verifyUserToken(req, res) {
    try {
      const token = req.params.id;
      if (token) {
        jwt.verify(
          token,
          process.env.JWT_ACC_ACTIVATE,
          function (err, decodedToken) {
            if (err) {
              return res.status(400).send({ error: err });
            }

            const name = decodedToken.name;
            const email = decodedToken.email;
            const phonenumber = decodedToken.phonenumber;
            const password = decodedToken.password;

            async function creatThisUser() {
              var user = new UserModel();
              user.name = name;
              user.email = email;
              user.phonenumber = phonenumber;

              //HASHING THE password with bcryptjs
              const salt = await bcriptjs.genSalt(10);
              const hashedPassword = await bcriptjs.hash(password, salt);
              user.password = hashedPassword;

              await user.save((err, docs) => {
                if (!err) {
                  return res.status(200).render('pages/welcome', {
                    title: process.env.EMAIL_SENDER
                  });
                } else {
                  return res.status(400).send({ error: err });
                }
              });
            }
            creatThisUser();
          }
        );
      } else {
        console.log(token);
        return res.status(400).send({ error: 'null token' });
      }
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async getIdFromToken(req, res) {
    try {
      const token = req.params.id;
      if (token) {
        jwt.verify(
          token,
          process.env.AUTH_TOKEN_SECRET,
          function (err, decodedToken) {
            if (err) {
              return res.status(400).send({ error: err });
            }
            async function getId(params) {
              const id = await decodedToken._id;

              return res.status(200).send({ id: id });
            }
            getId();
          }
        );
      } else {
        console.log(token);
        return res.status(400).send({ error: 'null token' });
      }
    } catch (err) {
      res.status(400).send({ error: err });
    }
  }
};

console.log('something');

function nameFromUri(myurl) {
  var parsed = url.parse(myurl);
  var image = path.basename(parsed.pathname);
  return 'images/' + path.parse(image).name;
}

async function destroy(file) {
  await cloudinary.delete(file);
}

const sendTokenResponse = (user, status, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() * 30 * 60 * 60 * 24 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(status)
    .cookie('token', token, options)
    .send({ token, level: user.level });
};

const emailPassword = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: options.html

    //${token}
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};
