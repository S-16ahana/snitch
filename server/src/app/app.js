import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from '../routes/auth.routes.js'
import productsRoute from '../routes/products.route.js'
import cartRoutes from '../routes/cart.route.js'
const app = express();

app.use(express.json());//when we post data in raw format but for form-data we use multer
app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use('/api/products',productsRoute)
app.use('/api/carts',cartRoutes)

export default app;