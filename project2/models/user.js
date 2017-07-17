// models/user.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const campusTypes      = require('./campus-types');
const departmentTypes  = require('./department-types');

const UserSchema = new Schema({
  name       :String,
  lastname   :String,
  campus     :campusTypes,
  department :departmentTypes,
  telephone  :Number,
  isAdmin    :{type:Boolean, default:false},
  isContributor:{type:Boolean, default:false},
  email      : String,
  username   : String,
  password   : String,
  description: String,
  imgUrl     : { type: String, default: "https://placeholdit.imgix.net/~text?txtsize=33&txt=250%C3%97250&w=250&h=250" }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;