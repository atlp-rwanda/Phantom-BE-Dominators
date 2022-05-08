import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';
import AppError from '../utils/appError';
import models from '../database/models';
import catchAsync from '../utils/catchAsync';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  //remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1)Check if email & password exist.
  if (!email || !password) {
    return next(new AppError(req.t('please'), 400));
  }

  //2)Check if user exist and password is correct

  const user = await models.User.findOne({ where: { email } });

  const correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError(req.t('incorrect'), 401));
  }

  //3)if everything is ok, then send token to user
  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  //1 Getting tocken and check its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token)
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }
  // 2. verificatoin token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3.check if user still exists

  const currentUser = await models.User.findOne({
    where: {
      id: decoded.id,
    },
  });

  if (!currentUser) {
    return next(
      new AppError('The token belonging to this use does no long exist.', 401)
    );
  }

  //Grant access to protected route
  req.user = currentUser;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
