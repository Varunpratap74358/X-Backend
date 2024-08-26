import Notification from '../models/notificationModel.js'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params
    const user = await User.findOne({ username }).select('-password')
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params
    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)
    // console.log(currentUser);
    // console.log(id, req.user.id)
    if (id === req.user.id) {
      return res.status(400).json({
        error: "You can't follow and unfollow yourself",
      })
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({
        error: 'user not found',
      })
    }

    const isFollowing = currentUser.following.includes(id)
    if (isFollowing) {
      //unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
      res.status(200).json({
        message: 'user unfollowd successfully',
      })
    } else {
      //follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })

      // send notification
      const newNotification = new Notification({
        type: 'follow',
        from: req.user._id,
        to: userToModify._id,
      })
      await newNotification.save()

      res.status(200).json({
        message: 'user followd successfully',
      })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getSuggistUser = async (req, res) => {
  try {
    const userId = req.user._id
    const userFollowdByMe = await User.findById(userId).select('following')
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ])
    const filterdUser = users.filter(
      (user) => !userFollowdByMe.following.includes(user._id),
    )
    const sugestedUser = filterdUser.slice(0, 4)
    sugestedUser.forEach((user) => (user.password = null))

    res.status(200).json(sugestedUser)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body
    let { profileImg, coverImg } = req.body

    const userId = req.user._id

    let user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        message: 'Please provide the new password and current password',
      })
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch)
        return res
          .status(400)
          .json({ message: 'Current password is incorrect' })

      user.password = await bcrypt.hash(newPassword, 10)
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split('/').pop().split('.'),
          [0],
        )
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg)
      profileImg = uploadedResponse.secure_url
    }
    if (coverImg) {
        if (user.coverImg) {
            await cloudinary.uploader.destroy(
              user.coverImg.split('/').pop().split('.'),
              [0],
            )
          }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg)
      coverImg = uploadedResponse.secure_url
    }

    user.fullName = fullName || user.fullName
    user.email = email || user.email
    user.username = username || user.username
    user.bio = bio || user.bio
    user.link = link || user.link
    user.profileImg = profileImg || user.profileImg
    user.coverImg = coverImg || user.coverImg

    user = await user.save()
    user.password = null

    res.status(200).json(user)
  } catch (error) {
    console.log(error);
    res.status(500).json({error: error.message })
  }
}
