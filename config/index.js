import development from './development'
import prodcution from './production'

export default {
  development,
  prodcution
}[`${process.env.NODE_ENV}`]
