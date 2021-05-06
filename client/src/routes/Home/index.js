import React from 'react';
import {
  NavbarComponent
} from '../../components';


export const Home = () => {


  // useEffect(() => {
  //   dispatch(request())
  // }, [dispatch])
  return (
    <div className='home-container'>
      <NavbarComponent />
      {/* <div className="container mt-3 mb-3">
        {
          chatReducer && chatReducer.chatData && chatReducer.chatData.length >= 0 ?
            (<ChatComponent chatReducer={chatReducer.chatData} />)
            :
            null
        }
      </div> */}
    </div>
  )
};
