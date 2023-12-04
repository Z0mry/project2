import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Use an array to store posts (this is just for demonstration, not suitable for production)
let posts = [];

app.get('/', (req, res) => {
  res.render('index', { posts });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', upload.single('image'), (req, res) => {
  const { content } = req.body;
  const newPost = { id: posts.length + 1, content, image: req.file ? req.file.buffer.toString('base64') : null };
  posts.push(newPost);
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(post => post.id === postId);
  if (post) {
    res.render('edit', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

app.post('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(post => post.id === postId);
  if (post) {
    post.content = req.body.content;
    res.redirect('/');
  } else {
    res.status(404).send('Post not found');
  }
});

app.post('/delete/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex(post => post.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
    res.redirect('/');
  } else {
    res.status(404).send('Post not found');
  }
});
app.get("/about", (req, res) => {
  res.render(__dirname + "/views/about.ejs");
})
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});


