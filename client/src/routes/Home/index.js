import _, { set } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Form, Image, Modal, OverlayTrigger, Popover, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  NavbarComponent
} from '../../components';
import InputComponent from '../../components/Input';
import {
  request as requestPost,
  requestUpdateStatus as reqStatusPost,
  requestUpdate,
  requestPost as postCreate,
  requestPager
} from '../../store/features/posts';
import {
  requestUpdateStatus as reqStatusInter
} from '../../store/features/interaction';
import { uploadPost } from '../../data';
import Swal from 'sweetalert2';
import validatorYoutube from 'youtube-url'
import YouTube from 'react-youtube';
import InfiniteScroll from "react-infinite-scroll-component";





export const Home = ({ socket }) => {
  const [file, setFile] = useState('')
  const [loader, setLoader] = useState(false)
  const [perPage, setPerPage] = useState(10)
  const [fileCreate, setFileCreate] = useState('')
  const [title, setTitle] = useState('');
  const [titleCreate, setTitleCreate] = useState('');
  const [link, setLink] = useState('');
  const [linkEdit, setLinkEdit] = useState('');
  const [show, setShow] = useState(false);
  const [editPost, setEditPost] = useState({ isShow: false, id: null });
  const [showConfirm, setShowConfirm] = useState({ isShow: false, id: null });
  const [showConfirmPost, setShowConfirmPost] = useState({ isShow: false, id: null });
  const dispatch = useDispatch()
  const postsReducer = useSelector(state => state.postsReducer)
  const interactionsReducer = useSelector(state => state.interactionsReducer)
  let user = JSON.parse(localStorage.getItem("_Auth"))

  useEffect(() => {

    dispatch(requestPost({ page: 1, perPage: perPage }))
    setLoader(true)
  }, [dispatch])

  useEffect(() => {
    if (editPost.id) {
      let findData = _.find(postsReducer.postsData, { _id: editPost.id })
      if (findData) {
        setTitle(findData.title)
        let isValid = validatorYoutube.extractId(findData.content)
        if (isValid) {
          setLinkEdit(findData.content)
        }
      }
    }
  }, [editPost.id])



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleConfirmClose = () => setShowConfirm({ isShow: false, id: null })

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

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    let dataUpload = null
    if (fileCreate) {
      formData.append("file", fileCreate);
      dataUpload = await uploadPost(formData)
    }
    let dataInsert = {}
    if (titleCreate) {
      dataInsert.title = titleCreate
    }
    if (dataUpload) {
      dataInsert.content = process.env.REACT_APP_API_URL + "/" + dataUpload?.data?.path || ""
    }
    if (link) {
      let a = validatorYoutube.extractId(link)
      if (!a) {
        Swal.fire("Chỉ được link youtube")
        return;
      }
      dataInsert.content = link
    }
    dispatch(postCreate(dataInsert))
    setTitleCreate('')
    setFileCreate('')
    setShow(false)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    let dataUpload = null
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
    if (linkEdit) {
      let a = validatorYoutube.extractId(linkEdit)
      if (!a) {
        Swal.fire("Chỉ được link youtube")
        return;
      }
      dataInsert.content = linkEdit
    }
    dispatch(requestUpdate(dataInsert))
    setFile('')
    setTitle('')
    setLinkEdit('')
    setEditPost({ isShow: false, id: null })
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
              <OverlayTrigger delay={{ show: 250, hide: 500 }}
                placement="right" overlay={
                  <Popover id="popover-basic">
                    <Popover.Content>
                      <Button variant="primary">Edit</Button>
                    </Popover.Content>
                    <Popover.Content>
                      <Button variant="danger" onClick={e => { if (x?.creator?._id !== user?.id) { Swal.fire("Bạn không có quyền"); return; } setShowConfirm({ isShow: true, id: x._id }) }}>Delete</Button>
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

  const fetchMoreData = () => {
    let perPageNew = perPage + 10
    dispatch(requestPager({ page: 1, perPage: perPageNew }))
    setLoader(false)
    setPerPage(perPageNew)
  }

  return (
    <div className='home-container'>
      <NavbarComponent />
      <div className="container mt-3 mb-3">
        <div className='wrap-margin'>
          <InfiniteScroll
            dataLength={postsReducer?.postsData.length}
            next={fetchMoreData}
            hasMore={loader}
            loader={<Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>}
          >
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
                              Bạn đang nghĩ gì thế?
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
                                  <OverlayTrigger delay={{ show: 250, hide: 500 }} placement='right' overlay={<Popover id="popover-basic">
                                    <Popover.Content>
                                      <Button variant="primary" onClick={e => { if (x?.creator?._id !== user?.id) { Swal.fire("Bạn không có quyền"); return; } setEditPost({ isShow: true, id: x._id }) }} >Edit</Button>
                                    </Popover.Content>
                                    <Popover.Content>
                                      <Button variant="danger" onClick={e => { if (x?.creator?._id !== user?.id) { Swal.fire("Bạn không có quyền"); return; }; setShowConfirmPost({ isShow: true, id: x._id }) }}>Delete</Button>
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
                                      x.content && validatorYoutube.extractId(x.content) ? <YouTube videoId={validatorYoutube.extractId(x.content)} className="w-100" /> : <Image src={x.content} width="100%" />
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
          </InfiniteScroll>
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
              <Form.Control type="text" placeholder="Nhập bình luận" className='border form-input-comment' value={titleCreate} onChange={e => setTitleCreate(e.target.value)} required />
              {
                fileCreate ? <Form.Control type="text" placeholder="Nhập link youtube" className='border form-input-comment' value={link} onChange={e => setLink(e.target.value)} required disabled={true} /> :
                  <Form.Control type="text" placeholder="Nhập link youtube" className='border form-input-comment' value={link} onChange={e => setLink(e.target.value)} required />
              }
              {
                link ? (<Form.File
                  id="custom-file"
                  label="Chọn hình ảnh"
                  disabled={true}
                />
                ) : (<Form.File
                  id="custom-file"
                  label="Chọn hình ảnh"
                  onChange={e => setFileCreate(e.target.files[0])}
                  accept="image/*"
                />)
              }
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreate}>Submit</Button>
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
              <Form.Control type="text" placeholder="Nhập link youtube" className='border form-input-comment' value={linkEdit} onChange={e => setLinkEdit(e.target.value)} />
              <Form.File
                id="custom-file"
                label="Thay đổi hình ảnh"
                accept="image/*"
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
