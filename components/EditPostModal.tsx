'use client'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment';
import {useUpdatePost} from '../public/DashBoard/useUpdatePost'
import {useGetSinglePostData} from '../public/DashBoard/useGetSinglePostData'
import { toast } from 'react-toastify'




interface FormData {
  title: string
  subject: string
  description: string
  date: Date
  username: string
  type: string
  image?: any
}

interface CreatePostModalProps {
  isOpen: any
  onClose: () => void
  refetchPost: any
}

const EditPostModal = ({ isOpen, onClose, refetchPost }: CreatePostModalProps) => {
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<FormData>()
  const [selectedDate, setSelectedDate] = useState<any>('')
  const [previewIMage, setPreVIewImage] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {postData, singlePostData} = useGetSinglePostData()
  const {updatePost, updatePostIsSuccess, updatePostLoading} = useUpdatePost()

  useEffect(()=>{
    if(isOpen){
        postData({id: isOpen})  
    }
  },[isOpen])

  useEffect(()=>{
    if(singlePostData){
        const {title, description, username, date, image, postType, subject} = singlePostData.data
        setValue('title', title)
        setValue('description', description)
        setValue('username', username)
        setValue('type', postType)
        setValue('subject', subject)
        setSelectedDate(date)
        setPreVIewImage(image)
    }

  },[singlePostData])
  

  useEffect(() => {
    if (updatePostIsSuccess) {
      toast.success('Post Updated Successfully.')
      onClose()
      refetchPost()
      reset()
      setPreVIewImage(null)
      setSelectedDate('')
    }

  }, [updatePostIsSuccess])

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append('postId', singlePostData?.data?._id)
    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("username", data.username);
    formData.append("description", data.description);
    formData.append("date", moment(selectedDate).format('YYYY-MM-DD'));
    formData.append("Post", data.type);
    formData.append('image', data.image)
    updatePost(formData)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setValue('image', file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreVIewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (event: React.MouseEvent) => {
    event.stopPropagation()
    setPreVIewImage(null)
    setValue('image', null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Transition appear show={isOpen !== false } as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 -m-6 mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold text-white leading-6"
                  >
                    Update Post
                  </Dialog.Title>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          {...register('title', { required: 'Title is required' })}
                          className={`w-full px-4 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-500'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Enter the title"
                        />
                        {errors.title && (
                          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          {...register('username', { required: 'Username is required' })}
                          className={`w-full px-4 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-500'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Enter the UserName"
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          {...register('subject', { required: 'Subject is required' })}
                          className={`w-full px-4 py-2 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-gray-500'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Enter the subject"
                        />
                        {errors.subject && (
                          <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          className={`w-full px-4 py-2 rounded-lg border ${errors.date ? 'border-red-500' : 'border-gray-500'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholderText="Select date"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image Upload
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                            hover:border-blue-500 transition-colors duration-200
                            ${previewIMage ? 'border-blue-500' : 'border-gray-500'}`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            {...register('image')}
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className="hidden"
                          />
                          {previewIMage ? (
                            <div className="relative">
                              <img
                                src={previewIMage}
                                alt="Preview"
                                className="max-h-40 w-full object-contain rounded-lg mb-2"
                              />
                              <div
                                onClick={removeImage}
                                className="absolute z-[9999] top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="text-sm text-gray-600">
                                <span className="text-blue-600 font-medium">Click to upload</span>
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description', {
                        required: 'Description is required',
                        minLength: { value: 10, message: 'Minimum 10 characters required' }
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-500'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      rows={3}
                      placeholder="Enter the description"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        {...register('type', { required: 'Type is required' })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.type ? 'border-red-500' : 'border-gray-500'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="" disabled>Select type</option>
                        <option value="News">News</option>
                        <option value="Event">Event</option>
                      </select>
                      {errors.type && (
                        <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm transform hover:scale-105 active:scale-95"
                    >
                      {updatePostLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : (
                        "Update Post"
                      )}

                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EditPostModal