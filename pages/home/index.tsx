import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar/Navbar';

const Home: NextPage = () => {
  const router=useRouter();
  return (
    <Navbar>
      <div>
      home
      </div>
    </Navbar>
  )
}

export default Home
