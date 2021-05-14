import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container, Form, ListGroup, Modal, Pagination, Row, Tab
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  NavbarComponent
} from '../../components';
import CreateComponent from '../../components/Create';
import { request as requestDepartment } from '../../store/features/department';
import { request as requestNew, requestDetail as requestNewDetail, clearDetail, requestUpdate, requestUpdateStatus } from '../../store/features/news';
import validate from 'objectid'

export const News = ({ socket }) => {
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const departmentReducer = useSelector(state => state.departmentReducer)
  const newsReducer = useSelector(state => state.newsReducer)
  let user = JSON.parse(localStorage.getItem("_Auth"));


  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(requestDepartment())
  }, [dispatch])

  useEffect(() => {
    if (newsReducer && newsReducer.newsDataDetail) {
      setTitle(newsReducer?.newsDataDetail?.title)
      setContent(newsReducer?.newsDataDetail?.content)
    }
  }, [newsReducer])

  useEffect(() => {
    let splitData = _.split(window.location.href, "#");
    let id = splitData[splitData.length - 1];
    if (validate.isValid(id)) {
      dispatch(requestNew({ department: id, page: page, perPage: 10 }))
    } else {
      dispatch(requestNew({ page: page, perPage: 10 }))
    }
  }, [dispatch, page])



  const handleClick = (e) => {
    let splitData = _.split(e.target.href, "#");
    let id = splitData[splitData.length - 1]
    if (validate.isValid(id)) {
      dispatch(requestNew({ department: id, page: page, perPage: 10 }))
    } else {
      dispatch(requestNew({ page: page, perPage: 10 }))
    }
  }
  const handleClose = () => {
    dispatch(clearDetail())
    setShow(false)
  };


  const handleRenderNews = (data) => {
    dispatch(requestNewDetail(data._id))
    setShow(true)
    return;
  }

  const handleSubmitEdit = (e, id) => {
    e.preventDefault();
    dispatch(requestUpdate({ id: id, title: title, content: content }))
    setEdit(false)
  }


  const handleClickEdit = (e, data) => {
    let checkData = _.includes(user.list_department, data?.department?._id)
    if (!checkData && user.type === 2) {
      Swal.fire("Bạn không quản lý phòng ban này")
      return;
    }
    setEdit(true);
  }

  const handleClickDelete = async (e, data) => {
    e.preventDefault();
    let checkData = _.includes(user.list_department, data?.department?._id)
    if (!checkData && user.type === 2) {
      Swal.fire("Bạn không quản lý phòng ban này")
      return;
    }
    if (data) {
      dispatch(requestUpdateStatus({ id: data._id, id_department: data?.department?._id, page: page }))
      setShow(false)
    }
  }

  const renderPagination = (data) => {
    let length = Math.ceil(data.total / 10)
    let items = []
    for (let index = 1; index <= length; index++) {
      items.push(
        <Pagination.Item key={index} active={page} onClick={e => setPage(index)} className={'ml-3'}>
          {index}
        </Pagination.Item>
      )
    }
    return items
  }

  const handleDefault = () => {
    let splitData = _.split(window.location.href, "#");
    let id = splitData[splitData.length - 1];
    return "#" + id;
  }

  const handleCloseCreate = (e) => {
    setShowCreate(false)
  }
  return (
    <div className='home-container'>
      <NavbarComponent />
      <Container className='mt-3'>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey={handleDefault}>
          <Row>
            <Col sm={3}>
              <ListGroup>
                <ListGroup.Item action href={"#"} onClick={handleClick}>
                  Tất cả thông báo
                </ListGroup.Item>
                {
                  departmentReducer?.departmentData ? _.map(departmentReducer?.departmentData, (x) => {
                    return (
                      <ListGroup.Item action href={"#" + x._id} onClick={handleClick}>
                        {x.name}
                      </ListGroup.Item>
                    )
                  }) : <React.Fragment />
                }
              </ListGroup>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                <Tab.Pane eventKey={"#"}>
                  <ListGroup variant="flush">
                    {
                      newsReducer?.newsData?.data ? (<React.Fragment>
                        <div>
                          {_.map(newsReducer?.newsData?.data, (x) => {
                            return (
                              <ListGroup.Item className="mb-3" onClick={(e) => handleRenderNews(x)}>
                                [{x?.department?.name}] - <span>({moment(x.createdAt).format("YYYY-MM-DD HH:mm:ss")})</span>
                                <div>
                                  {x.title}
                                </div>
                              </ListGroup.Item>
                            )
                          })}
                        </div>
                        <Pagination>
                          {
                            renderPagination(newsReducer?.newsData)
                          }
                        </Pagination>
                      </React.Fragment>
                      ) : <React.Fragment />
                    }
                  </ListGroup>
                </Tab.Pane>
                {
                  departmentReducer?.departmentData ? _.map(departmentReducer?.departmentData, (x) => {
                    return (
                      <Tab.Pane eventKey={"#" + x._id}>
                        <ListGroup variant="flush">
                          {
                            newsReducer?.newsData?.data ? (<React.Fragment>
                              <div>
                                {_.map(newsReducer?.newsData?.data, (x) => {
                                  return (
                                    <ListGroup.Item className="mb-3" onClick={(e) => handleRenderNews(x)}>
                                      [{x?.department?.name}] - <span>({moment(x.createdAt).format("YYYY-MM-DD HH:mm:ss")})</span>
                                      <div>
                                        {x.title}
                                      </div>
                                    </ListGroup.Item>
                                  )
                                })}
                              </div>
                              <Pagination>
                                {
                                  renderPagination(newsReducer?.newsData)
                                }
                              </Pagination>
                            </React.Fragment>
                            ) : <React.Fragment />
                          }
                        </ListGroup>
                      </Tab.Pane>
                    )
                  }) : <React.Fragment />
                }
              </Tab.Content>
            </Col>
            <Col sm={1}>
              {
                user.type !== 3 ? (
                  <Button onClick={e => setShowCreate(true)}>Tạo</Button>
                ) : <React.Fragment />
              }
            </Col>
          </Row>
        </Tab.Container>
      </Container>
      {
        newsReducer?.newsDataDetail ? (
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            size="lg"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{
                edit === false ? <React.Fragment>
                  {
                    newsReducer?.newsDataDetail?.title || ""
                  }
                  ({
                    moment(newsReducer?.newsDataDetail?.createdAt).format("YYYY-MM-DD HH:mm:ss")
                  })</React.Fragment> : (
                  <Form.Control type="text" placeholder="Nhập title" value={title} onChange={e => setTitle(e.target.value)} />
                )
              }
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                edit === false ? <React.Fragment>
                  {
                    newsReducer?.newsDataDetail?.content || ""
                  }
                </React.Fragment> : (
                  <Form.Control type="text" placeholder="Nhập content" value={content} onChange={e => setContent(e.target.value)} />
                )
              }
            </Modal.Body>
            <Modal.Footer>
              {
                user.type !== 3 ? (
                  edit === false ? (<React.Fragment>
                    <Button variant="primary" onClick={e => handleClickEdit(e, newsReducer?.newsDataDetail)}>
                      Edit
                  </Button>
                    <Button variant="danger" onClick={e => handleClickDelete(e, newsReducer?.newsDataDetail)}>
                      Delete
                  </Button>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                  </Button>
                  </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Button variant="primary" onClick={(e) => { setEdit(false); setContent(newsReducer?.newsDataDetail?.content); setTitle(newsReducer?.newsDataDetail?.title) }}>
                        Cancel
                    </Button>
                      <Button variant="primary" onClick={(e) => handleSubmitEdit(e, newsReducer?.newsDataDetail?._id)}>
                        Submit
                    </Button>
                    </React.Fragment>
                  )) : (<Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>)
              }
            </Modal.Footer>
          </Modal>
        ) : <React.Fragment />
      }
      <CreateComponent show={showCreate} setShow={setShowCreate} handleClose={handleCloseCreate} department={departmentReducer?.departmentData} user={user} socket={socket} />
    </div>
  )
};
