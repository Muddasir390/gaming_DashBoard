"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Trash2, ChevronDown } from 'lucide-react';
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import CreatePostModal from "../components/CreatePostModal";
import { useGetAllPost } from "../public/Post/useGetAllPost";
import {useDeletePost} from '../public/DashBoard/useDeletePost'
import ConfirmationModal from "../components/ConfirmationModal";
import EditPostModal from "../components/EditPostModal";
import { toast } from 'react-toastify'


const PostSkeleton = () => {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <td key={item} className="px-6 py-4">
          <div className="bg-[#94a3b8] h-4 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
};

const Post = () => {
  const { postData, postLoading, refetchPost } = useGetAllPost();
  const {deletePost, deletePostLoading, deletePostIsSucces} =useDeletePost()
  const allPosts = postData?.postsRes || [];

  useEffect(()=>{
    if(deletePostIsSucces){
      toast.success('Post Deleted Successfully.')
      setShowConfirmationModal(false)
      refetchPost()
    }
  },[deletePostIsSucces])

  const [activeSection, setActiveSection] = useState("Post");
  const [showModal, setShowModal] = useState(false);
  const [showEditMOdal, setShowEditModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allPosts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteSinglePost=()=>{
    const apiData = {postId: showConfirmationModal}
    deletePost(apiData)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <SideBar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
         <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="">
            <div className="mb-8 flex flex-row items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                All Posts
              </h1>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg w-52 hover:shadow-xl"
              >
                <span className="font-semibold">Create New Post</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">+</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <tr>
                      {['Title', 'Subject', 'Type', 'Username', 'Date', 'Description', 'Image', 'Actions'].map((header) => (
                        <th 
                          key={header}
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-100"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50">
                    {currentItems && currentItems?.length ? currentItems.map((post:any) => (
                      <tr key={post._id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{post.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{post.subject}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{post.postType}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{post.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(post.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{post.description}</td>
                        <td className="px-6 py-4">
                          <img src={post.image} alt={post.title} className="w-16 h-16 rounded-md object-cover" />
                        </td>
                        <td className="px-6 py-4 flex gap-3">
                          <button onClick={()=> setShowEditModal(post?._id)} className="text-blue-500 hover:text-blue-700"><Pencil size={18} /></button>
                          <button onClick={()=> setShowConfirmationModal(post?._id)}  className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    )) : postLoading ? Array.from({ length: 10 }).map((_, index) => (
                      <PostSkeleton key={index} />
                    ))
                  : <div>No Record Found.</div> }
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-2 mt-6">
              <button 
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button 
                  key={i + 1} 
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-2 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} refetchPost={refetchPost} />
      <EditPostModal isOpen={showEditMOdal} onClose={()=> setShowEditModal(false)} refetchPost={refetchPost} />
      <ConfirmationModal isOpen={showConfirmationModal} onClose={()=> setShowConfirmationModal(false)} onConfirm={()=> deleteSinglePost()} loading={deletePostLoading} />
    </div>
  );
};

export default Post;