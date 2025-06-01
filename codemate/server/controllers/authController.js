export const authSuccess = (req, res) => {
    const { token, user } = req.user;
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}&name=${user.name}`);
  };
  