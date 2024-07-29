/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Form, Label, Button } from "reactstrap";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import classnames from 'classnames';
import { useGetUserQuery, useUpdateAdminUserMutation, useUploadProfileImgMutation } from "../../redux/api/userAPI";
import userImg from "../../assets/img/user.png";
import { isObjEmpty } from "../../utils/Utils";

const UserUpdate = () => {
    const { id } = useParams();
    const [avatarFile, setAvatarFile] = useState(null);
    const [updateAdminUser, { isLoading, isError, error, isSuccess, data }] = useUpdateAdminUserMutation();
    const [uploadProfileImg] = useUploadProfileImgMutation();
    const { data: userItem, refetch: refetchUser } = useGetUserQuery(id);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    useEffect(() => {
        refetchUser();
    }, []);

    useEffect(() => {
        if (userItem) {
            const fields = ['firstname', 'lastname', 'email', 'address', 'phone'];
            fields.forEach((field) => setValue(field, userItem[field]));
            if (userItem.avatar) {
                setAvatarFile(userItem.avatar);
            }
        }
    }, [userItem]);

    const onSubmit = (data) => {
        if (avatarFile) {
            data.avatar = avatarFile;
        }
        if (isObjEmpty(errors)) {
            updateAdminUser({ id: id, user: data });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/admin/users');
        }

        if (isError) {
            if (isSuccess && data?.message) {
                toast.success(data.message);
            } else if (isError && error?.data) {
                const errorMessage = typeof error.data === 'string' ? error.data : error.data?.message;
                toast.error(errorMessage || 'שגיאה לא ידועה התרחשה', {
                    position: 'top-right',
                });
            }
        }
    }, [isLoading]);

    const handleImageChange = async (e) => {
        e.preventDefault();

        // Check if files array is present and has at least one file.
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Ensure that the file is of File or Blob type (File inherits from Blob).
            if (file instanceof Blob) {
                let reader = new FileReader();

                reader.onload = (event) => {
                    const result = event.target?.result;
                    if (typeof result === 'string') {
                        setAvatarFile(result);
                    }
                };

                reader.readAsDataURL(file);
                try {
                    const result = await uploadProfileImg(file).unwrap();
                    const avatarData = result.data.updateAvatar.avatar;
                    setAvatarFile(avatarData)
                } catch (error) {
                    // Handle the error case here
                    console.error('An error occurred during image upload:', error);
                }
            } else {
                // Handle the error case where the file is not a Blob
                console.error('The provided file is not of type Blob.');
            }
        } else {
            // Handle the case where no file was selected
            console.error('No file selected.');
        }
    };

    return (
        <div className="main-board">
            <Container>
                <Row>
                    <Col>
                        <h3>Create User</h3>
                    </Col>
                </Row>
                <Card>
                    <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row className="my-3">
                                <Col md="4" className="d-flex justify-content-center">
                                    <div className="mb-3">
                                        <Label>User Image</Label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            className="form-control"
                                            name="avatar"
                                            onChange={handleImageChange}
                                            accept=".png, .jpg, .jpeg"
                                            style={{ display: 'none' }} // hide the input
                                        />
                                        <label htmlFor="avatar" className="d-flex" style={{ cursor: 'pointer' }}>
                                            <img
                                                id="user-preview"
                                                src={avatarFile || userImg}
                                                alt="Preview"
                                                width="180px"
                                                height="180px"
                                            />
                                        </label>
                                    </div>
                                </Col>
                                <Col md="8">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='mb-2'>
                                                <Label>Firstname</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.firstname })}`}
                                                    type="text"
                                                    id="firstname"
                                                    {...register('firstname', { required: true })}
                                                />
                                                {errors.firstname && <small className="text-danger">Firstname is required.</small>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='mb-2'>
                                                <Label>Lastname</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.lastname })}`}
                                                    type="text"
                                                    id="lastname"
                                                    {...register('lastname', { required: true })}
                                                />
                                                {errors.lastname && <small className="text-danger">Lastname is required.</small>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mb-2'>
                                        <Label>Email</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                            type="email"
                                            id="email"
                                            {...register('email', { required: true })}
                                        />
                                        {errors.email && <small className="text-danger">Email is required.</small>}
                                    </div>
                                    
                                    <div className='mb-2'>
                                        <Label>Address</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.address })}`}
                                            type="text"
                                            id="address"
                                            {...register('address', { required: true })}
                                        />
                                        {errors.address && <small className="text-danger">Address is required.</small>}
                                    </div>
                                    <div className='mb-2'>
                                        <Label>Phone</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.phone })}`}
                                            type="text"
                                            id="phone"
                                            {...register('phone', {
                                                required: "Phone is required",
                                                pattern: {
                                                    value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                                                    message: "Invalid phone number",
                                                },
                                            })}
                                        />
                                        {errors.phone && <small className="text-danger">Phone is required.</small>}
                                    </div>
                                    <div className="mt-4">
                                        <Button color="primary" className="btn-block" type="submit">
                                            Submit
                                        </Button>
                                    </div>

                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </div>
    )
}

export default UserUpdate;