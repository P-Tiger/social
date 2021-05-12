import React, { useState } from 'react';
import { Button, Col, Form, Image, InputGroup, Modal, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import {
  NavbarComponent
} from '../../components';


export const Home = ({ socket }) => {
  const [show, setShow] = useState(false);
  let user = JSON.parse(localStorage.getItem("_Auth"))

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // useEffect(() => {
  //   dispatch(request())
  // }, [dispatch])

  const handleSubmitDot = (e) => {
    e.preventDefault();
    console.log(e)
  }

  const handleSubmitComment = (e) => {
    e.preventDefault();
    console.log(e)
  }


  const handleEditDot = (e) => {
    e.preventDefault();
    console.log(e)
  }
  const popover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <Button variant="primary" onClick={handleEditDot}>Edit</Button>
      </Popover.Content>
      <Popover.Content>
        <Button variant="danger" onClick={handleEditDot}>Delete</Button>
      </Popover.Content>
    </Popover>
  )

  return (
    <div className='home-container'>
      <NavbarComponent />
      <div className="container mt-3 mb-3">
        <div className='wrap-margin'>
          <div className="border bg-wrap mb-3">
            <div>
              <div className='input-wrap'>
                <Image src={"https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="35px" height="35px" roundedCircle className="border" />
                <div className='border w-75  wrap-border-input' onClick={handleShow}>
                  <div>
                    <span className='text ml-3'>
                      Bạn đang nghĩ gì về mình?
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border bg-wrap mb-3">
            <div>
              <div className='wrap header'>
                <div className='user'>
                  <Image src={"https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="35px" height="35px" roundedCircle className="border mr-3" />
                  <strong>You</strong>
                </div>
                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                  <div className='btn_dot'>
                    <i class="fas fa-ellipsis-h"></i>
                  </div>
                </OverlayTrigger>
              </div>
              <div className='wrap content'>
                <div className='title'>
                  This is titledasdsadasdassasdasdasdasdasldkjasod;as o;iasdo;iasdo;s D;OIs d;iah daish dialuhd laiilasu dail daislud
                </div>
                <div className='image_video'>
                  <Image src={"https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="100%" />
                </div>
              </div>
              <hr />

              <div className='ml-3 more-commit'>Xem thêm bình luận</div>
              <div className='wrap user_comment'>
                <div className='user'>
                  <Image src={"https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="35px" height="35px" roundedCircle className="border mr-3" />
                </div>
                <div className='comment w-100 border'>
                  <strong className='css-utils'>You</strong>
                  <div className='css-utils content_comment'>
                    daaddsadasadasd asd askd lksaj dalksj dlsakd jalsk jdlaks jdalsk jdaslk jdalskj daslkdj alskj dalskdj
                  </div>
                </div>
                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                  <div className='btn_dot'>
                    <i class="fas fa-ellipsis-h"></i>
                  </div>
                </OverlayTrigger>
              </div>

              <div className='wrap user_comment'>
                <div className='user'>
                  <Image src={"https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="35px" height="35px" roundedCircle className="border mr-3" />
                </div>
                <div className='comment w-100 border'>
                  <strong className='css-utils'>Peter Parker</strong>
                  <div className='css-utils content_comment'>
                    daaddsadasadasd asd askd lksaj dalksj dlsakd jalsk jdlaks jdalsk jdaslk jdalskj daslkdj alskj dalskdj
                  </div>
                </div>
                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                  <div className='btn_dot'>
                    <i class="fas fa-ellipsis-h"></i>
                  </div>
                </OverlayTrigger>
              </div>
              <hr />
              <div className='wrap footer'>
                <Image src={"https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="35px" height="35px" roundedCircle className="border mr-3" />
                <Form className='form-comment' onSubmit={handleSubmitComment}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Nhập bình luận" className='border form-input-comment' />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>



      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Don't even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
};
