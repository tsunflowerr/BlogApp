import Notification from "../models/notificationModel.js"

export async function getNotification(req, res) {
    try {
        const notification = await Notification.find({author:req.user._id}).populate("user", "username avatar").sort({createAt:-1})
        if(!notification) {
            return res.status(404).json({success: false, message: "No notification found"})
        }
        res.status(200).json({success:true, notification})
    }
    catch(error){
        console.error('Error fetching notification:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id, 
      { isRead: true }, 
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Error update notification:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
