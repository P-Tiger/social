import _, { set } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Form, Image, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  NavbarComponent
} from '../../components';
import InputComponent from '../../components/Input';
import {
  request as requestPost,
  requestUpdateStatus as reqStatusPost,
  requestUpdate
} from '../../store/features/posts';
import {
  requestUpdateStatus as reqStatusInter
} from '../../store/features/interaction';
import { uploadPost } from '../../data';



export const Home = ({ socket }) => {
  const [file, setFile] = useState('')
  const [title, setTitle] = useState('');
  const [show, setShow] = useState(false);
  const [editPost, setEditPost] = useState({ isShow: false, id: null });
  const [showConfirm, setShowConfirm] = useState({ isShow: false, id: null });
  const [showConfirmPost, setShowConfirmPost] = useState({ isShow: false, id: null });
  const dispatch = useDispatch()
  const postsReducer = useSelector(state => state.postsReducer)
  const interactionsReducer = useSelector(state => state.interactionsReducer)
  let user = JSON.parse(localStorage.getItem("_Auth"))

  useEffect(() => {
    dispatch(requestPost())
  }, [dispatch])

  useEffect(() => {
    if (editPost.id) {
      let findData = _.find(postsReducer.postsData, { _id: editPost.id })
      if (findData) {
        setTitle(findData.title)
      }
    }
  }, [editPost.id])



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleConfirmClose = () => setShowConfirm({ isShow: false, id: null })


  const handleSubmitDot = (e) => {
    e.preventDefault();
    console.log(e)
  }


  const handleSubmitComment = (e) => {
    e.preventDefault();
  }

  const handleDotEdit = (e, id) => {
    e.preventDefault();

  }
  const handleDotDelete = (e) => {
    e.preventDefault();
    dispatch(reqStatusInter({ id: showConfirm.id }))
    setShowConfirm({ isShow: false, id: null })
  }

  const handleDotDeletePost = (e) => {
    e.preventDefault();
    dispatch(reqStatusPost({ id: showConfirmPost.id }))
    setShowConfirmPost({ isShow: false, id: null })
  }

  const handleChangeImage = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    let dataUpload = null
    let image = null
    if (file) {
      formData.append("file", file);
      dataUpload = await uploadPost(formData)
    }
    let dataInsert = {
      id: editPost.id
    }
    if (dataUpload) {
      dataInsert.content = process.env.REACT_APP_API_URL + "/" + dataUpload?.data?.path || ""
    }
    if (title) {
      dataInsert.title = title
    }
    dispatch(requestUpdate(dataInsert))
    setFile('')
    setTitle('')
    setShowConfirmPost({ isShow: false, id: null })
  }

  const renderComment = (post_id, dataComment) => {
    let findData = _.filter(dataComment, { post_id: post_id })
    if (findData.length > 0) {
      return (
        _.map(findData, (x) => {
          return (
            <div className='wrap user_comment'>
              <div className='user'>
                <Image src={x?.creator?.student_info?.image || "https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="35px" height="35px" roundedCircle className="border mr-3" />
              </div>
              <div className='comment w-100 border'>
                <strong className='css-utils'>
                  {x?.creator?.name} ({moment(x.createdAt).format("YYYY-MM-DD HH:mm:ss")})
                    </strong>
                <div className='css-utils content_comment'>
                  {
                    x?.comment || ""
                  }
                </div>
              </div>
              <OverlayTrigger delay={{ show: 250, hide: 3000 }}
                placement="right" overlay={
                  <Popover id="popover-basic">
                    <Popover.Content>
                      <Button variant="primary">Edit</Button>
                    </Popover.Content>
                    <Popover.Content>
                      <Button variant="danger" onClick={e => setShowConfirm({ isShow: true, id: x._id })}>Delete</Button>
                    </Popover.Content>
                  </Popover>}
              >
                <div className='btn_dot'>
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </OverlayTrigger>
            </div>
          )
        })
      )
    }
    return <React.Fragment />
  }

  return (
    <div className='home-container'>
      <NavbarComponent />
      <div className="container mt-3 mb-3">
        <div className='wrap-margin'>
          {
            postsReducer?.postsData && interactionsReducer?.interactionsData ?
              (
                <React.Fragment>
                  <div className="border bg-wrap mb-3">
                    <div className='input-wrap'>
                      <Image src={user?.image || "https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="35px" height="35px" roundedCircle className="border" />
                      <div className='border w-75  wrap-border-input' onClick={handleShow}>
                        <div>
                          <span className='text ml-3'>
                            Bạn đang nghĩ gì về mình?
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    _.map(postsReducer.postsData, (x) => {
                      return (
                        <>
                          <div className="border bg-wrap mb-3">
                            <div>
                              <div className='wrap header'>
                                <div className='user'>
                                  <Image src={x?.creator?.student_info?.image || "https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="35px" height="35px" roundedCircle className="border mr-3" />
                                  <strong>{x?.creator?.name}</strong>
                                </div>
                                <OverlayTrigger delay={{ show: 250, hide: 3000 }} placement='right' overlay={<Popover id="popover-basic">
                                  <Popover.Content>
                                    <Button variant="primary" onClick={e => setEditPost({ isShow: true, id: x._id })} >Edit</Button>
                                  </Popover.Content>
                                  <Popover.Content>
                                    <Button variant="danger" onClick={e => setShowConfirmPost({ isShow: true, id: x._id })}>Delete</Button>
                                  </Popover.Content>
                                </Popover>}>
                                  <div className='btn_dot'>
                                    {moment(x?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                                    <i class="fas fa-ellipsis-h ml-3"></i>
                                  </div>
                                </OverlayTrigger>
                              </div>
                              <div className='wrap content'>
                                <div className='title'>
                                  {x.title}
                                </div>
                                <div className='image_video'>
                                  {
                                    x.content ? <Image src={x.content} width="100%" /> : <React.Fragment />
                                  }
                                </div>
                              </div>
                              <hr />
                              {
                                renderComment(x._id, interactionsReducer?.interactionsData)
                              }
                              <hr />
                              <div className='wrap footer'>
                                <InputComponent list_post={_.map(postsReducer?.postsData, "_id")} id={x._id} user={user} />
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })
                  }</React.Fragment>
              ) : <React.Fragment />
          }
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo Bài Viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='form-comment'>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Nội dung bài viết</Form.Label>
              <Form.Control type="text" placeholder="Nhập bình luận" className='border form-input-comment' value={title} onChange={e => setTitle(e.target.value)} />
              <Form.File
                id="custom-file"
                label="chọn hình ảnh"
                onChange={handleChangeImage}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={editPost.isShow}
        onHide={() => setEditPost({ isShow: false, id: null })}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='form-comment'>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Nội dung bài viết</Form.Label>
              <Form.Control type="text" placeholder="Nhập bình luận" className='border form-input-comment' value={title} onChange={e => setTitle(e.target.value)} />
              <Form.File
                id="custom-file"
                label="Thay đổi hình ảnh"
                onChange={handleChangeImage}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditPost({ isShow: false, id: null })}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitEdit}>Submit</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirm.isShow}
        onHide={handleConfirmClose}
        backdrop="static"
        centered
        keyboard={false}
      >
        <Modal.Body>
          Bạn có chắc muốn xoá không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmClose}>
            Không
          </Button>
          <Button variant="primary" onClick={handleDotDelete}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirmPost.isShow}
        onHide={() => setShowConfirmPost({ isShow: false, id: null })}
        backdrop="static"
        centered
        keyboard={false}
      >
        <Modal.Body>
          Bạn có chắc muốn xoá không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmPost({ isShow: false, id: null })}>
            Không
          </Button>
          <Button variant="primary" onClick={handleDotDeletePost}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
};
