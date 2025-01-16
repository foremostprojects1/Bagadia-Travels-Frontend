"use client";
import Breadcrumb from "@/components/common/Breadcrumb";
import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import SelectComponent from "@/uitils/SelectComponent";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "../../../loading.js";
import axios from "axios";
import { useParams } from "next/navigation.js";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./custom.css"

import { toast, ToastContainer } from "react-toastify";
const page = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const params = useParams();
  const destination = params.destination;

  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [tourTitle, setTourTitle] = useState("");

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    if (fullName === "" || contactNumber === "") {
      toast.error("Please fill in all fields.");
      return; // Exit the function early if any field is empty
    }
    try {
      // Constructing the form data object
      const formData = {
        tourTitle,
        fullName,
        contactNumber,
      };

      const response = await axios
        .post(
          "https://bagadia-travels.onrender.com/api/v1/inquiry/addSmallInquiry",
          formData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });

      setFullName("");
      setContactNumber("");
      // console.log("Inquiry submitted successfully!");
    } catch (error) {
      // console.error("Error submitting inquiry:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .get(
            `https://bagadia-travels.onrender.com/api/v1/tour/getToursByName/${destination}`,
            { withCredentials: true }
          )
          .then((response) => {
            // console.log("data" + response.data)
            setData(response.data.tour);
            setOriginalData(response.data.tour);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSortChange = (selectedOption) => {
    // console.log("Selected option:", selectedOption);
    const sortedData = [...data];
    if (selectedOption === "Price Low to High") {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (selectedOption === "Price High to Low") {
      sortedData.sort((a, b) => b.price - a.price);
    }
    setData(sortedData);
    setSortOrder(selectedOption);
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(event.target.value);
    const filteredData = originalData.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
    setData(filteredData);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* <ToastContainer /> */}
          <Modal open={open} onClose={onCloseModal} center>
            <form className="formModal">
              <div className="form-inner mb-20">
                <input
                  disabled
                  type="text"
                  style={{ fontSize: "1.5vw" }}
                  placeholder={tourTitle}
                />
              </div>
              <div className="form-inner mb-20">
                <input
                  type="text"
                  style={{ fontSize: "1.5vw" }}
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="form-inner mb-20">
                <input
                  type="tel"
                  style={{ fontSize: "1.5vw" }}
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
              <button
                type="submit"
                onClick={handleFormSubmission}
                className="primary-btn1 two"
              >
                Send Inquiry
              </button>
            </form>
          </Modal>
          <Header />
          <Breadcrumb pagename="Tour Packages" pagetitle="Tour Packages" />
          <div className="package-grid-with-sidebar-section pt-120 mb-120">
            <div className="container">
              <div className="row g-lg-4 gy-5">
                <div className="col-lg-12">
                  <div className="package-inner-title-section mb-40">
                    {/* <p>Showing 1–12 of 101 results</p> */}
                    {/* <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    /> */}
                    <div className="selector-and-grid">
                      <div className="selector">
                        <SelectComponent
                          options={["Price Low to High", "Price High to Low"]}
                          placeholder="Default Sorting"
                          onChange={handleSortChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="list-grid-product-wrap mb-70">
                    {data == "" ? <h1>Coming Soon</h1> : <></>}
                    <div className="row gy-4">
                      {!isLoading &&
                        data &&
                        data.map((item) => (
                          <div className="col-lg-4 col-md-6">
                            <div className="package-card">
                              <div className="package-card-content">
                                <div className="card-content-top">
                                  <h5>
                                    <Link
                                      href={`/package/package-details/${item._id}`}
                                    >
                                      {item.title && item.title}
                                    </Link>
                                  </h5>
                                </div>
                              </div>
                              <div className="package-card-img-wrap">
                                <Link
                                  href={`/package/package-details/${item._id}`}
                                  className="card-img"
                                  style={{ display: "block", width: "100%" }} // Ensure the link takes the full width
                                >
                                  <img
                                    src={
                                      item.images &&
                                      item.images[0] &&
                                      item.images[0]
                                    }
                                    alt=""
                                    style={{ width: "100%", height: "50vh" }}
                                  />
                                </Link>
                                <div className="batch">
                                  <span className="date">
                                    {item.days && item.days} Days /{" "}
                                    {item.nights && item.nights} Night
                                  </span>
                                  {/* <div className="location">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={18}
                                      height={18}
                                      viewBox="0 0 18 18"
                                    >
                                      <path d="M8.99939 0C5.40484 0 2.48047 2.92437 2.48047 6.51888C2.48047 10.9798 8.31426 17.5287 8.56264 17.8053C8.79594 18.0651 9.20326 18.0646 9.43613 17.8053C9.68451 17.5287 15.5183 10.9798 15.5183 6.51888C15.5182 2.92437 12.5939 0 8.99939 0ZM8.99939 9.79871C7.19088 9.79871 5.71959 8.32739 5.71959 6.51888C5.71959 4.71037 7.19091 3.23909 8.99939 3.23909C10.8079 3.23909 12.2791 4.71041 12.2791 6.51892C12.2791 8.32743 10.8079 9.79871 8.99939 9.79871Z" />
                                    </svg>
                                    <ul className="location-list">
                                      <li>
                                        <h6>{item.country && item.country}</h6>
                                      </li>
                                    </ul>
                                  </div> */}
                                </div>
                              </div>
                              <div className="package-card-content">
                                <div className="card-content-top">
                                  <h5>
                                    <Link
                                      href={`/package/package-details/${item._id}`}
                                    >
                                      Tour Type:{" "}
                                      {item.tourType && item.tourType}
                                    </Link>
                                  </h5>
                                  <div className="location-area">
                                    <ul className="location-list scrollTextAni">
                                      {item.places &&
                                        item.places.map((place) => (
                                          <li>
                                            <span>{place}</span>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                </div>
                                <div className="card-content-bottom">
                                  <div className="price-area">
                                    <h6>Starting Form:</h6>
                                    {/* <span
                                      className="formSpan"
                                    >
                                      ₹ {item.price && item.price}
                                    </span> */}
                                    <span className="formSpan">
                                      ₹{" "}
                                      {item.paxData
                                        ? item.paxData["2Pax"] ||
                                          item.paxData["4Pax"] ||
                                          item.paxData["6Pax"] ||
                                          item.paxData["8Pax"] ||
                                          item.paxData["10Pax"] ||
                                          "N/A"
                                        : item.price}
                                    </span>
                                  </div>  
                                  <div className="price-area">
                                    <h6>Mode Of Conveyance:</h6>
                                    <span>
                                      {item.transportMode && item.transportMode}
                                    </span>
                                  </div>
                                  <button
                                    // href={`/package/package-details/${item._id}`}
                                    className="primary-btn2"
                                    onClick={(e) => {
                                      setTourTitle(item.title);
                                      onOpenModal();
                                    }}
                                  >
                                    Inquire
                                    <svg
                                      fill="white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      class="bi bi-chat-right-dots"
                                      viewBox="0 0 16 16"
                                    >
                                      {" "}
                                      <path
                                        d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"
                                        fill="white"
                                      ></path>{" "}
                                      <path
                                        d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                                        fill="white"
                                      ></path>{" "}
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-lg-12">
                      <nav className="inner-pagination-area">
                        <ul className="pagination-list">
                          <li>
                            <a href="#" className="shop-pagi-btn">
                              <i className="bi bi-chevron-left" />
                            </a>
                          </li>
                          <li>
                            <a href="#">1</a>
                          </li>
                          <li>
                            <a href="#" className="active">
                              2
                            </a>
                          </li>
                          <li>
                            <a href="#">3</a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="bi bi-three-dots" />
                            </a>
                          </li>
                          <li>
                            <a href="#">6</a>
                          </li>
                          <li>
                            <a href="#" className="shop-pagi-btn">
                              <i className="bi bi-chevron-right" />
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div> */}
                </div>
                {/* <div className="col-lg-4">
                  <div className="sidebar-area">
                    <div className="single-widget mb-30">
                      <h5 className="widget-title">Activity</h5>
                      <ul className="category-list">
                        <li>
                          <Link href="/blog">All Package</Link>
                        </li>
                        <li>
                          <Link href="/blog">Beaches</Link>
                        </li>
                        <li>
                          <Link href="/blog">City Tours</Link>
                        </li>
                        <li>
                          <Link href="/blog">Cruises</Link>
                        </li>
                        <li>
                          <Link href="/blog">Hiking</Link>
                        </li>
                        <li>
                          <Link href="/blog">Historical</Link>
                        </li>
                        <li>
                          <Link href="/blog">Museum Tours</Link>
                        </li>
                        <li>
                          <Link href="/blog">Adventure</Link>
                        </li>
                      </ul>
                    </div>
                    <div className="single-widget mb-30">
                      <h5 className="widget-title">Destination</h5>
                      <ul className="category-list two">
                        <li>
                          <Link href="/blog">
                            Indonesia
                            <span>20</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog">
                            Switzerland
                            <span>35</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog">
                            Egypt
                            <span>25</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog">
                            Saudi Arab
                            <span>18</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog">
                            Europe
                            <span>06</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog">
                            Bangladesh
                            <span>08</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog">
                            Luxury Retreat
                            <span>15</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog">
                            Photography Expedition
                            <span>25</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="single-widget mb-30">
                      <h5 className="widget-title">Durations</h5>
                      <ul className="category-list">
                        <li>
                          <Link href="/blog">1 - 2 Days Tour</Link>
                        </li>
                        <li>
                          <Link href="/blog">2 - 3 Days Tour</Link>
                        </li>
                        <li>
                          <Link href="/blog">4 - 5 Days Tour</Link>
                        </li>
                        <li>
                          <Link href="/blog">6 - 7 Days Tour</Link>
                        </li>
                        <li>
                          <Link href="/blog">8 - 9 Days Tour</Link>
                        </li>
                        <li>
                          <Link href="/blog">10 - 13 Days Tour</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          {/* <Newslatter /> */}
          <Footer />
        </>
      )}
    </>
  );
};

export default page;
