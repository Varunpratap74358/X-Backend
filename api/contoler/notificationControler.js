import Notification from '../models/notificationModel.js'

export const getNotiFication = async (req, res) => {
  try {
    const userId = req.user._id
    const notifications = await Notification.find({ to: userId }).populate({
      path: 'from',
      select: 'username profileImg',
    })
    await Notification.updateMany({ to: userId }, { read: true })
    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id
    await Notification.deleteMany({ to: userId })
    res.status(200).json({ message: 'Notification Deleted Sucessfully...' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id
    const notificationId = req.params.id
    const notification = await Notification.findById(notificationId)
    if(!notification){
        return res.status(404).json({error:"Notification not found"})
    }
    if(notification.to.toString() !== userId.toString()){
        return res.status(404).json({error:"You are not allowed to delete this notification"})
    }
    await Notification.findByIdAndDelete(notificationId)
    res.status(200).json({ message: 'One Notification Deleted Sucessfully...' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
