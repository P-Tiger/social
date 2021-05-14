
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Col,
    Container,
    Form,
    Image,
    Row
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavbarComponent } from '../../components';
import { requestDetail, requestUpdate } from '../../store/features/user';
import {
    uploadPost
} from '../../data/upload'

export const Me = () => {
    let user = JSON.parse(localStorage.getItem("_Auth"));
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [faculty, setFaculty] = useState('')
    const [classroom, setClassroom] = useState('')
    const [file, setFile] = useState('')
    const userReducer = useSelector(state => state.userReducer)
    // let history = useHistory()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(requestDetail(user.id))
    }, [dispatch, user.id])

    useEffect(() => {
        if (userReducer?.userData) {
            setClassroom(userReducer?.userData?.student_info?.class_room);
            setFaculty(userReducer?.userData?.student_info?.faculty)
            setName(userReducer?.userData?.name)
        }
    }, [userReducer?.userData])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        let dataUpload = null
        let image = null
        if (file) {
            formData.append("file", file);
            dataUpload = await uploadPost(formData)
        }
        if (dataUpload) {
            image = process.env.REACT_APP_API_URL + "/" + dataUpload?.data?.path || ""
        }
        let dataDispatch = {}
        if (image) {
            dataDispatch.image = image
        }
        if (name) {
            dataDispatch.name = name
        }
        if (faculty) {
            dataDispatch.faculty = faculty
        }
        if (classroom) {
            dataDispatch.class_room = classroom
        }
        if (password) {
            dataDispatch.password = password
        }
        dispatch(requestUpdate(dataDispatch))
        setPassword('')
        setClassroom('')
        setFaculty('')
        setFile('')
        setName('')
    }

    const handleChangeImage = (e) => {
        setFile(e.target.files[0])
    }


    return (
        <React.Fragment>
            <NavbarComponent />
            {
                userReducer?.userData ? (<div className="container mt-3 mb-3">
                    <Form onSubmit={handleSubmit}>
                        {
                            _.includes([2, 3], user?.type) ?
                                (
                                    user?.type === 2 ? (
                                        <Form.Group controlId="formBasicName">
                                            <Form.Label>Họ và tên</Form.Label>
                                            <Form.Control type="text" placeholder="Nhập tên" value={name} />
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                                        </Form.Group>
                                    ) : (
                                        <Form.Group controlId="formBasicName">
                                            <Form.Label>Hình ảnh đại diện</Form.Label>
                                            <Form.File
                                                id="custom-file"
                                                label="Thay đổi hình ảnh"
                                                onChange={handleChangeImage}
                                                accept="image/*"
                                            />
                                            <Container>
                                                <Row>
                                                    <Col xs={6} md={4}>
                                                        <Image src={userReducer?.userData?.student_info?.image || "https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png"} width="200px" height="200px" roundedCircle />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Form.Label>Họ và tên</Form.Label>
                                            <Form.Control type="text" placeholder="Nhập tên" value={name} onChange={e => setName(e.target.value)} />
                                            <Form.Label>Lớp</Form.Label>
                                            <Form.Control type="text" placeholder="Nhập tên" value={classroom} onChange={e => setClassroom(e.target.value)} />
                                            <Form.Label>Khoa</Form.Label>
                                            <Form.Control type="text" placeholder="Nhập tên" value={faculty} onChange={e => setFaculty(e.target.value)} />
                                        </Form.Group>
                                    )
                                ) : (
                                    <React.Fragment />
                                )
                        }
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>) : <React.Fragment />
            }

        </React.Fragment>
    )
}
