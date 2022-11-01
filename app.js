const express = require('express');

const { sequelize, User, Post } = require('./models');

const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const user = await User.create({ name, email, role });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.put('/users/:uuid', async (req, res) => {
  const { name, role } = req.body;
  const { uuid } = req.params;

  try {
    const user = await User.update({ name, role }, { where: { uuid } });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: 'posts',
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong!!' });
  }
});

app.get('/users/:uuid', async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.findOne({
      where: {
        uuid,
      },
    });

    if (!user) {
      return res.json({ error: 'No record found!!' });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong!!' });
  }
});

app.post('/posts', async (req, res) => {
  const { userUuid, body } = req.body;

  try {
    const user = await User.findOne({ where: { uuid: userUuid } });
    const post = await Post.create({ body, userId: user.id });

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong!!' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({ include: 'user' });

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong!!' });
  }
});

app.listen({ port: 5000 }, async () => {
  console.log('Server up connection on http://localhost:5000');
  await sequelize.authenticate();
  console.log('database connected!!');
});
