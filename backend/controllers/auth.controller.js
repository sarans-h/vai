import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if(!name || !email || !password || name === '' || email === '' || password === ''){
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, isAdmin:newUser.isAdmin }, process.env.JWT_SECRET_KEY,);
    const { password :pass, ...rest} = newUser._doc
    res.status(201).cookie('access_token', token, {
      sameSite: 'None',
      // httpOnly: true,//to prevent access from javascript(commented to access in frontend)
       httpOnly: true, 
  secure:true, // Enable secure only in production
  path: '/',
      maxAge: 24 * 60 * 60 * 1000, 
    }).json({ message: 'Signup successful', user: newUser });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
console.log(password)
  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email }).select("+password");

    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    const token = jwt.sign({ id: validUser._id, isAdmin:validUser.isAdmin }, process.env.JWT_SECRET_KEY,);
    // console.log(token)
    console.log(token)

     const { password :pass, ...rest} = validUser._doc
    
    res.status(200).cookie('access_token', token, {
      sameSite: 'None',
        // httpOnly: true,//to prevent access from javascript(commented to access in frontend)
          httpOnly: true, 
  secure:true, // Enable secure only in production
  path: '/',
      maxAge: 24 * 60 * 60 * 1000, 
      })
      .json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signout = (req, res, next) => {
  try{
    res.clearCookie('access_token').status(200).json('User has been signed out');
  } 
  catch(err){
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    console.log("calling getUser");
    // console.log(req.user)
    const user = await User.findById(req.user.id).select("-password");
    // console.log(user);
    res.status(200).json(user);
    } catch (error) {
      next(error);
    }
};

export const getPLHistory = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('profitLossHistory');
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        res.status(200).json({ success: true, profitLossHistory: user.profitLossHistory });
    } catch (error) {
        next(error);
    }
};

export const addDummyData = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Dummy dailyPortfolio data
        const dummyDailyPortfolio = [
            { date: new Date('2023-09-01'), value: 1200 },
            { date: new Date('2023-09-02'), value: 1250 },
            { date: new Date('2023-09-03'), value: 1300 },
            { date: new Date('2023-09-04'), value: 1280 },
            { date: new Date('2023-09-05'), value: 1350 },
        ];

        // Insert dummy dailyPortfolio data
        user.dailyPortfolio = dummyDailyPortfolio;

        // Calculate profitLossHistory based on dailyPortfolio
        const sortedPortfolio = user.dailyPortfolio.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        const calculatedPLHistory = [];

        for (let i = 0; i < sortedPortfolio.length; i++) {
            if (i === 0) {
                // Assuming the first day's profitLoss is the portfolio value itself
                calculatedPLHistory.push({
                    date: sortedPortfolio[i].date,
                    profitLoss: sortedPortfolio[i].value
                });
            } else {
                const profitLoss = sortedPortfolio[i].value - sortedPortfolio[i - 1].value;
                calculatedPLHistory.push({
                    date: sortedPortfolio[i].date,
                    profitLoss: profitLoss
                });
            }
        }

        // Assign the calculated P/L history
        user.profitLossHistory = calculatedPLHistory;

        await user.save();

        res.status(200).json({ success: true, message: "Dummy data added successfully with calculated P/L history." });
    } catch (error) {
        next(error);
    }
};
