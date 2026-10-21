import { Link } from 'react-router-dom'
import { Img } from '../components/ui/Img'

export default function NotFound() {
  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden bg-midnight text-pearl">
      <Img name="woodenPier" alt="" className="img-cover absolute inset-0 opacity-40" />
      <div className="relative px-6 text-center">
        <p className="eyebrow text-gold">Lost at sea</p>
        <h1 className="mt-4 text-6xl md:text-8xl">This shore is uncharted.</h1>
        <p className="mx-auto mt-6 max-w-md text-pearl/75">The page you were looking for has drifted away. Let us guide you back.</p>
        <Link to="/" className="btn btn-gold mt-10">Return home</Link>
      </div>
    </section>
  )
}
