import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Catalogos from './pages/Catalogos'
import Localizacao from './pages/Localizacao'
import Pessoas from './pages/Pessoas'
import Equipamentos from './pages/Equipamentos'
import Componentes from './pages/Componentes'
import Perifericos from './pages/Perifericos'
import Especificacoes from './pages/Especificacoes'
import Layout from './components/Layout'


export default function App(){
  return (
    <Routes>
        <Route path="/" element={<Login/>} />
        <Route element={<Layout/>}>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/catalogos" element={<Catalogos/>} />
          <Route path="/localizacao" element={<Localizacao/>} />
          <Route path="/pessoas" element={<Pessoas/>} />
          <Route path="/equipamentos" element={<Equipamentos/>} />
          <Route path="/componentes" element={<Componentes/>} />
          <Route path="/perifericos" element={<Perifericos/>} />
          <Route path="/especificacoes" element={<Especificacoes/>} />
        </Route>
    </Routes>
  )
}