import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

const List = ({ data, onDelete }) => {
    const cookies = new Cookies();
    const [type,setType] = useState(cookies.get('type'))
    const [authorID,setAuthorID] = useState(cookies.get('authorID'))

    const handleDelete = (itemId) => {
        // Call onDelete with the itemId to trigger deletion
        onDelete(itemId);
      };

    const imgUrl = "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D"
    return (
        <div className="">
            {data.map(item => (
                <div key={item.ArticleID} className="rounded overflow-hidden shadow hover:shadow-2xl my-4">
                    <Link to={`/news-detail/${item.ArticleID}`} className="flex">
                        <img src={item.MLink} alt={item.ArTitle} className="w-48 h36 aspect-w-4 aspect-h-3 object-cover block my-4 mx-4" />
                        <div className="px-6 py-4 overflow-hidden">
                            <div className="font-bold text-xl text-blue1 mb-2">{item.ArTitle}</div>
                            <p className="text-bluelight text-base line-clamp-3">{item.ArContent}</p>
                        </div>
                    </Link>
                    {/* { (type=='Author' && authorID && authorID==item.AuthorID) &&
                    <div className="flex justify-end px-4 pb-4">
                        <div className="inline-flex items-center rounded-md shadow-sm">
                            <button className="text-slate-800 hover:text-primary-700 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                </span>
                                <span>Edit</span>
                            </button>
                            <button className="text-slate-800 hover:text-primary-700 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                                onClick={() => handleDelete(item.ArticleID)}
                            >
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                </span>
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                    } */}
                    { (type=='Editor' || type=='Author' && authorID && authorID==item.AuthorID) && 
                        <div className="flex justify-end px-4 pb-4">
                            <div className="inline-flex items-center rounded-md shadow-sm">
                                <button className="text-slate-800 hover:text-primary-700 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                                    onClick={() => handleDelete(item.ArticleID)}
                                >
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    </span>
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    }
                </div>
            ))}
        </div>
    );
}

export default List;