import React, { useState } from 'react'
import { assets } from '../assets/assets'


//input field component
const InputField =({type , placeholder , name , handlechange ,address})=>(
    <input className='w-full px-2 py-2.5 border border-gray-500/10 rounded outline-none 
    text-gray-500 focus:border-primary transition' type={type} 
    placeholder={placeholder}
    onChange={handlechange}
    name={name}
    value={address[name]}
    required
    />
)

const AddAddress = () => {

    const [address , setAddress] = useState({
        firstname: '',
        lastname: '',
        email: '',
        street: '',
        city :'',
        state:'',
        zipcode:'',
        country:'',
        phone:'',

    });

    const handleChange = (e) =>{
        const {name , value} = e.target;

        setAddress((prevAddress)=>({
            ...prevAddress,
            [name]: value,

        }))
    }

    const onSubmitHandler = async (e)=>{
        e.preventDefault();
    }



  return (
    <div className='mt-16 pb-16'>
        <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span
        className='font-semibold text-primary'> Address</span></p>
        
        <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
            <div className='flex-1 max-w-md'>
            <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
               
                <div className='grid grid-cols-2 gap-4'>
                    <InputField handleChange={handleChange} address={address} 
                    name='Firstname' type="text" placeholder='First Name' />
                     <InputField handleChange={handleChange} address={address} 
                    name='Lastname' type="text" placeholder='Last Name' />
                </div>

                <InputField handleChange={handleChange} address={address} 
                    name='Email' type="email" placeholder='Email Address' />
                <InputField handleChange={handleChange} address={address} 
                    name='Street' type="text" placeholder='Street' />

                <div className='grid grid-cols-2 gap-4'>
                    <InputField handleChange={handleChange} address={address} 
                    name='City' type="text" placeholder='City' />
                    <InputField handleChange={handleChange} address={address} 
                    name='State' type="text" placeholder='State' />
                </div>

                 <div className='grid grid-cols-2 gap-4'>
                    <InputField handleChange={handleChange} address={address} 
                    name='Zip Code' type="number" placeholder='Zip Code' />
                    <InputField handleChange={handleChange} address={address} 
                    name='Country' type="text" placeholder='Country' />
                </div>

                <InputField handleChange={handleChange} address={address} 
                    name='Phone' type="text" placeholder='Phone' />

                <button className='w-full mt-6 bg-primary text-white py-3 
                hover:bg-primary-dull transition cursror-pointer uppercase'>
                    Save address
                </button>
            </form>

            </div>
            <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add Address" />
        </div>


    </div>
  )
}

export default AddAddress