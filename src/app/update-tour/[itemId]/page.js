"use client";
import Breadcrumb from "@/components/common/Breadcrumb";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import "./style.css";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import Loader from "../../loading.js";

const page = () => {
  const params = useParams();
  const tourId = params.itemId;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [paxData, setPaxData] = useState({
    "2Pax": 0,
    "4Pax": 0,
    "6Pax": 0,
    "8Pax": 0,
    "10Pax": 0,
  });
  const [country, setCountry] = useState("");
  const [transportMode, setTransportMode] = useState("");
  const [tourType, setTourType] = useState("");
  const [tourDepartureDate, setTourDepartureDate] = useState("");

  const [images, setImages] = useState([]);
  const [numPlaces, setNumPlaces] = useState(0);
  const [places, setPlaces] = useState([]);

  const [maxPeople, setMaxPeople] = useState("");
  const [days, setDays] = useState(0);
  const [daysDescription, setDaysDescription] = useState([]);
  const [daysTitles, setDaysTitles] = useState([]);
  const [nights, setNights] = useState(0);
  const [tourDescription, setTourDescription] = useState("");
  const [included, setIncluded] = useState("");
  const [excluded, setExcluded] = useState("");

  const [numStops, setNumStops] = useState(0);
  const [returnNumStops, setReturnNumStops] = useState(0);

  const [numStay, setNumStay] = useState(0);
  const handleNumStaysChange = (e) => {
    const stay = parseInt(e.target.value);
    setNumStay(stay);
  };

  const [hotelDetails, setHotelDetails] = useState(() => {
    const initialDetails = Array.from({ length: numStay }, () => ({
      cityName: "",
      hotelName: "",
      roomType: "",
      checkIn: "",
      checkOut: "",
    }));
    return initialDetails;
  });

  const handlePaxDataChange = (key, value) => {
    setPaxData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleHotelDetailsChange = (index, field, value) => {
    setHotelDetails((prevModeDetails) => {
      // Ensure the index is within bounds or equal to the length of the array
      if (index >= 0 && index <= prevModeDetails.length) {
        const updatedDetails = [...prevModeDetails];
        // If index equals the length, it means adding a new element
        if (index === prevModeDetails.length) {
          updatedDetails.push({
            cityName: "",
            hotelName: "",
            roomType: "",
            checkIn: "",
            checkOut: "",
          });
        }
        updatedDetails[index][field] = value;
        return updatedDetails;
      } else {
        console.error(`Index ${index} is out of bounds.`);
        return prevModeDetails; // Return the original array if index is invalid
      }
    });
  };

  const handleNumStopsChange = (e) => {
    const stops = parseInt(e.target.value);
    setNumStops(stops);
  };

  const handleReturnNumStopsChange = (e) => {
    const stops = parseInt(e.target.value);
    setReturnNumStops(stops);
  };

  const [modeDetails, setModeDetails] = useState(() => {
    const initialDetails = Array.from({ length: numStops + 1 }, () => ({
      name: "",
      number: "",
      from: "",
      departureTime: "",
      to: "",
      arrivalTime: "",
    }));
    return initialDetails;
  });

  const [returnModeDetails, setReturnModeDetails] = useState(() => {
    const initialDetails = Array.from({ length: numStops + 1 }, () => ({
      name: "",
      number: "",
      from: "",
      departureTime: "",
      to: "",
      arrivalTime: "",
    }));
    return initialDetails;
  });

  const handleModeDetailsChange = (index, field, value) => {
    setModeDetails((prevModeDetails) => {
      if (index >= 0 && index <= prevModeDetails.length) {
        const updatedDetails = [...prevModeDetails];

        if (index === prevModeDetails.length) {
          updatedDetails.push({
            name: "",
            number: "",
            from: "",
            departureTime: "",
            to: "",
            arrivalTime: "",
          });
        }
        updatedDetails[index][field] = value;
        return updatedDetails;
      } else {
        console.error(`Index ${index} is out of bounds.`);
        return prevModeDetails;
      }
    });
  };
  const handleReturnModeDetailsChange = (index, field, value) => {
    setReturnModeDetails((prevModeDetails) => {
      if (index >= 0 && index <= prevModeDetails.length) {
        const updatedDetails = [...prevModeDetails];

        if (index === prevModeDetails.length) {
          updatedDetails.push({
            name: "",
            number: "",
            from: "",
            departureTime: "",
            to: "",
            arrivalTime: "",
          });
        }
        updatedDetails[index][field] = value;
        return updatedDetails;
      } else {
        console.error(`Index ${index} is out of bounds.`);
        return prevModeDetails;
      }
    });
  };

  const router = useRouter();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleNumPlacesChange = (e) => {
    const num = parseInt(e.target.value);
    if (!isNaN(num) && num >= 0) {
      setNumPlaces(num);
      setPlaces(Array(num).fill(""));
    } else {
      setNumPlaces(null);
      setPlaces([]);
    }
  };

  const handlePlaceInputChange = (index, value) => {
    const newPlaces = [...places];
    newPlaces[index] = value;
    setPlaces(newPlaces);
  };

  const handleDayDescriptionChange = (index, value) => {
    const newDescriptions = [...daysDescription];
    newDescriptions[index] = value;
    setDaysDescription(newDescriptions);
  };

  const handleDayTitleChange = (index, value) => {
    const newTitles = [...daysTitles];
    newTitles[index] = value;
    setDaysTitles(newTitles);
  };

  const handleFormSubmission = async (e) => {
    // console.log("Form " + JSON.stringify(modeDetails));
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      images.forEach((image) => formData.append("images", image));

      places.forEach((place, index) => formData.append(`places`, place));
      formData.append("maxPeople", maxPeople);
      formData.append("days", days);
      daysDescription.forEach((description, index) =>
        formData.append(`daysDescription`, description)
      );
      daysTitles.forEach((title, index) =>
        formData.append(`daysTitles`, title)
      );
      formData.append("nights", nights);
      formData.append("tourDescription", tourDescription);
      formData.append("included", included);
      formData.append("excluded", excluded);
      formData.append("country", country);
      formData.append("transportMode", transportMode);
      formData.append("modeDetails", JSON.stringify(modeDetails));
      formData.append("returnModeDetails", JSON.stringify(returnModeDetails));
      formData.append("hotelDetails", JSON.stringify(hotelDetails));
      formData.append("tourType", tourType);
      formData.append("tourDepartureDate", tourDepartureDate);
      formData.append("paxData", JSON.stringify(paxData));

      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }

      await axios
        .put(
          `https://bagadia-travels.onrender.com/api/v1/tour/update/${tourId}`,
          // `http://localhost:4000/api/v1/tour/update/${tourId}`,
          formData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          alert(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          router.push("/all-tour");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://bagadia-travels.onrender.com/api/v1/tour/getTour/${tourId}`
        );
        const tourData = response.data.tour;

        setTitle(tourData.title);
        setPrice(tourData.price);
        setCountry(tourData.country);
        setTransportMode(tourData.transportMode);
        setTourType(tourData.tourType);
        if (tourData.tourType == "Group Tour") {
          setTourDepartureDate(new Date(tourData.tourDepartureDate));
        } else {
          setTourDepartureDate(new Date());
        }

        setImages(tourData.images || []);

        setNumPlaces(tourData.places?.length || 0);
        setPlaces(tourData.places || []);

        setMaxPeople(tourData.maxPeople);
        setDays(tourData.days);
        setDaysDescription(tourData.daysDescription || []);
        setDaysTitles(tourData.daysTitles || []);
        setNights(tourData.nights);
        setTourDescription(tourData.tourDescription);
        setIncluded(tourData.included);
        setExcluded(tourData.excluded);
        setPaxData(tourData.paxData);

        if (tourData.modeDetails.length <= 1) {
          setNumStops(0);
        } else {
          setNumStops(tourData.modeDetails?.length);
        }
        if (tourData.returnModeDetails.length <= 1) {
          setReturnNumStops(0);
        } else {
          setReturnNumStops(tourData.returnModeDetails?.length);
        }

        if (tourData.hotelDetails.length > 0) {
          setNumStay(tourData.hotelDetails.length);
        } else {
          setNumStay(0);
        }
        setModeDetails(tourData.modeDetails);
        setReturnModeDetails(tourData.returnModeDetails);
        setHotelDetails(tourData.hotelDetails);

        console.log(JSON.stringify(modeDetails));
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourData();
  }, [tourId]);

  return (
    <>
      {!isLoading && (
        <>
          <Header />
          <Breadcrumb pagename="Update your tour" pagetitle="Update Tour" />
          {/* {children} */}
          <ToastContainer />

          <div
            className="login-modal"
            id="user-login"
            // data-bs-keyboard="false"
            // tabIndex={-1}
            // aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-close-btn" data-bs-dismiss="modal" />
                <div className="modal-header">
                  {/* <img
                src="/assets/img/home1/login-modal-header-img.jpg"
                alt="loginImage"
              /> */}
                </div>
                <div className="modal-body">
                  <div className="login-registration-form">
                    <form
                      onSubmit={handleFormSubmission}
                      encType="multipart/form-data"
                    >
                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <input
                          type="text"
                          placeholder="Title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>

                      <div
                    className="form-inner mb-20"
                    style={{ width: "40vw", margin: "1vmax auto" }}
                  >
                    {paxData && Object.entries(paxData).map(([key, value]) => (
                      <div
                        key={key}
                        className="form-inner mb-20"
                        style={{
                          width: "40vw",
                          margin: "1vmax auto",
                        }}
                      >
                        <label
                          htmlFor="numPlaces"
                          style={{ fontSize: "1vmax" }}
                        >
                          Price for {key}
                        </label>
                        <input
                          type="number"
                          placeholder={`Enter price for ${key}`}
                          value={value}
                          onChange={(e) => handlePaxDataChange(key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <input
                          type="text"
                          placeholder="Price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <input
                          type="text"
                          placeholder="Destination"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </div>
                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <label
                          className="custom-file-input"
                          style={{ color: "#fff" }}
                        >
                          Upload Images
                          <input
                            type="file"
                            onChange={handleImageChange}
                            multiple
                          />
                        </label>
                        {images &&
                          images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt=""
                              style={{ width: "200px", height: "150px" }}
                            />
                          ))}
                      </div>
                      <div
                        className="form-inner mb-20"
                        style={{
                          width: "40vw",
                          margin: "1vmax auto",
                          display: "flex",
                        }}
                      >
                        <label
                          htmlFor="numPlaces"
                          style={{ fontSize: "1vmax" }}
                        >
                          Number Of Places
                        </label>
                        <input
                          placeholder="Number Of Places"
                          type="number"
                          id="numPlaces"
                          value={numPlaces}
                          onChange={handleNumPlacesChange}
                        />
                      </div>
                      {numPlaces > 0 && (
                        <div
                          className="form-inner mb-20"
                          style={{ width: "20vw", margin: "1vmax auto" }}
                        >
                          {places.map((place, index) => (
                            <input
                              key={index}
                              type="text"
                              value={place}
                              onChange={(e) =>
                                handlePlaceInputChange(index, e.target.value)
                              }
                              style={{ margin: "0.5vmax 0" }}
                              placeholder={`Place ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <input
                          type="number"
                          placeholder="Min People"
                          value={maxPeople}
                          onChange={(e) => setMaxPeople(e.target.value)}
                        />
                      </div>

                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <label htmlFor="tourType" style={{ fontSize: "1vmax" }}>
                          Tour Type
                        </label>
                        <select
                          id="tourType"
                          value={tourType}
                          onChange={(e) => setTourType(e.target.value)}
                        >
                          <option value="">Select Tour Type</option>
                          <option value="Group Tour">Group Tour</option>
                          <option value="Private Van Tour">
                            Private Van Tour
                          </option>
                        </select>
                      </div>

                      {tourType == "Group Tour" && (
                        <>
                          <div
                            className="form-inner mb-20"
                            style={{ width: "40vw", margin: "1vmax auto" }}
                          >
                            <label
                              htmlFor="tourType"
                              style={{ fontSize: "1vmax" }}
                            >
                              Tour Departure Date
                            </label>
                            <DatePicker
                              selected={tourDepartureDate}
                              onChange={(date) => setTourDepartureDate(date)}
                              dateFormat="dd/MM/yyyy"
                              minDate={new Date()}
                            />
                          </div>
                        </>
                      )}
                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <label
                          htmlFor="transportMode"
                          style={{ fontSize: "1vmax" }}
                        >
                          Mode of Transport
                        </label>
                        <select
                          id="transportMode"
                          value={transportMode}
                          onChange={(e) => setTransportMode(e.target.value)}
                        >
                          <option value="">Select Mode of Transport</option>
                          <option value="flight">Flight</option>
                          <option value="bus">Bus</option>
                          <option value="train">Train</option>
                          <option value="land">Land</option>
                        </select>
                      </div>
                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <input
                          type="text"
                          placeholder="Tour Description"
                          value={tourDescription}
                          onChange={(e) => setTourDescription(e.target.value)}
                        />
                      </div>
                      <div>
                        <div
                          className="form-inner mb-20"
                          style={{ width: "40vw", margin: "1vmax auto" }}
                        >
                          <textarea
                            placeholder="Included"
                            value={included}
                            onChange={(e) => setIncluded(e.target.value)}
                          />
                        </div>
                        <div
                          className="form-inner mb-20"
                          style={{ width: "40vw", margin: "1vmax auto" }}
                        >
                          <textarea
                            placeholder="Excluded"
                            value={excluded}
                            onChange={(e) => setExcluded(e.target.value)}
                          />
                        </div>
                      </div>
                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <label
                          htmlFor="numPlaces"
                          style={{ fontSize: "1vmax" }}
                        >
                          Number Of Days
                        </label>
                        <input
                          type="number"
                          placeholder="Days"
                          value={days}
                          onChange={(e) => setDays(e.target.value)}
                        />
                      </div>
                      <div
                        className="form-inner mb-20"
                        style={{ width: "40vw", margin: "1vmax auto" }}
                      >
                        <label
                          htmlFor="numPlaces"
                          style={{ fontSize: "1vmax" }}
                        >
                          Number Of Nights
                        </label>
                        <input
                          type="number"
                          placeholder="Nights"
                          value={nights}
                          onChange={(e) => setNights(e.target.value)}
                        />
                      </div>
                      <div
                        className="form-inner mb-20"
                        style={{
                          width: "40vw",
                          margin: "1vmax auto",
                          display: "flex",
                        }}
                      >
                        <label style={{ fontSize: "1vmax" }}>
                          Enter Detail Description of days
                        </label>
                      </div>

                      {days > 0 &&
                        Array.from({ length: days }).map((_, index) => (
                          <div
                            className="form-inner mb-20"
                            style={{
                              width: "40vw",
                              margin: "1vmax auto",
                              display: "flex",
                            }}
                            key={index}
                          >
                            <div style={{ marginRight: "1rem" }}>
                              <label htmlFor={`day${index + 1}`}>{`Day ${
                                index + 1
                              } Title:`}</label>
                              <input
                                type="text"
                                id={`day${index + 1}`}
                                value={daysTitles[index]}
                                onChange={(e) =>
                                  handleDayTitleChange(index, e.target.value)
                                }
                                placeholder={`Title for Day ${index + 1}`}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`day${index + 1}Description`}
                              >{`Day ${index + 1} Description:`}</label>
                              <textarea
                                id={`day${index + 1}Description`}
                                value={daysDescription[index]}
                                onChange={(e) =>
                                  handleDayDescriptionChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder={`Description for Day ${index + 1}`}
                              />
                            </div>
                          </div>
                        ))}

                      <div
                        className="form-inner mb-20"
                        style={{
                          width: "40vw",
                          margin: "1vmax auto",
                          display: "flex",
                        }}
                      >
                        <label htmlFor="numStay">Number of Stay:</label>
                        <input
                          type="number"
                          id="numStay"
                          value={numStay}
                          onChange={handleNumStaysChange}
                        />
                      </div>
                      {numStay >= 0 && (
                        <div
                          className="form-inner mb-20"
                          style={{
                            width: "40vw",
                            margin: "1vmax auto",
                            display: "flex",
                          }}
                        >
                          {[...Array(numStay)].map((_, index) => (
                            <div
                              className="form-inner mb-20"
                              style={{
                                width: "40vw",
                                margin: "1vmax auto",
                                display: "flex",
                              }}
                            >
                              <div key={index} style={{ marginRight: "1rem" }}>
                                <h4>Stay {index + 1} Details:</h4>
                                <div className="form-inner mb-20">
                                  <input
                                    type="text"
                                    placeholder={`City Name`}
                                    value={hotelDetails[index]?.cityName || ""}
                                    onChange={(e) =>
                                      handleHotelDetailsChange(
                                        index,
                                        "cityName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="form-inner mb-20">
                                  <input
                                    type="text"
                                    placeholder={`Hotel Name`}
                                    value={hotelDetails[index]?.hotelName || ""}
                                    onChange={(e) =>
                                      handleHotelDetailsChange(
                                        index,
                                        "hotelName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="form-inner mb-20">
                                  <input
                                    type="text"
                                    placeholder={`Room Type`}
                                    value={hotelDetails[index]?.roomType || ""}
                                    onChange={(e) =>
                                      handleHotelDetailsChange(
                                        index,
                                        "roomType",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="form-inner mb-20">
                                  <input
                                    type="date"
                                    placeholder={`Check In`}
                                    value={hotelDetails[index]?.checkIn || ""}
                                    onChange={(e) =>
                                      handleHotelDetailsChange(
                                        index,
                                        "checkIn",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="form-inner mb-20">
                                  <input
                                    type="date"
                                    placeholder={`Check Out`}
                                    value={hotelDetails[index]?.checkOut || ""}
                                    onChange={(e) =>
                                      handleHotelDetailsChange(
                                        index,
                                        "checkOut",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {transportMode !== "land" && (
                        <>
                          <div
                            className="form-inner mb-20"
                            style={{
                              width: "40vw",
                              margin: "1vmax auto",
                              display: "flex",
                            }}
                          >
                            <label htmlFor="numStops">
                              Number of Stops For Departure:
                            </label>
                            <input
                              type="number"
                              id="numStops"
                              value={numStops}
                              onChange={handleNumStopsChange}
                            />
                          </div>
                          {numStops >= 0 && (
                            <div
                              className="form-inner mb-20"
                              style={{
                                width: "40vw",
                                margin: "1vmax auto",
                                display: "flex",
                              }}
                            >
                              {[...Array(numStops + 1)].map((_, index) => (
                                <div
                                  className="form-inner mb-20"
                                  style={{
                                    width: "40vw",
                                    margin: "1vmax auto",
                                    display: "flex",
                                  }}
                                >
                                  <div
                                    key={index}
                                    style={{ marginRight: "1rem" }}
                                  >
                                    <h4>Travel {index + 1} Details:</h4>
                                    <div className="form-inner mb-20">
                                      <input
                                        type="text"
                                        placeholder={`${transportMode} Name`}
                                        value={modeDetails[index]?.name || ""}
                                        onChange={(e) =>
                                          handleModeDetailsChange(
                                            index,
                                            "name",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="form-inner mb-20">
                                      <input
                                        type="text"
                                        placeholder={`${transportMode} Number`}
                                        value={modeDetails[index]?.number || ""}
                                        onChange={(e) =>
                                          handleModeDetailsChange(
                                            index,
                                            "number",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="form-inner mb-20">
                                      <input
                                        type="text"
                                        placeholder={`${transportMode} From`}
                                        value={modeDetails[index]?.from || ""}
                                        onChange={(e) =>
                                          handleModeDetailsChange(
                                            index,
                                            "from",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    <div className="form-inner mb-20">
                                      <input
                                        type="text"
                                        placeholder={`${transportMode} Departure Time`}
                                        value={
                                          modeDetails[index]?.departureTime ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleModeDetailsChange(
                                            index,
                                            "departureTime",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="form-inner mb-20">
                                      <input
                                        type="text"
                                        placeholder={`${transportMode} To`}
                                        value={modeDetails[index]?.to || ""}
                                        onChange={(e) =>
                                          handleModeDetailsChange(
                                            index,
                                            "to",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    <div className="form-inner mb-20">
                                      <input
                                        type="text"
                                        placeholder={`${transportMode} Arrival Time`}
                                        value={
                                          modeDetails[index]?.arrivalTime || ""
                                        }
                                        onChange={(e) =>
                                          handleModeDetailsChange(
                                            index,
                                            "arrivalTime",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div
                            className="form-inner mb-20"
                            style={{
                              width: "40vw",
                              margin: "1vmax auto",
                              display: "flex",
                            }}
                          >
                            <label htmlFor="numStops">
                              Number of Stops For Return:
                            </label>
                            <input
                              type="number"
                              id="numStops"
                              value={returnNumStops}
                              onChange={handleReturnNumStopsChange}
                            />
                          </div>
                          {returnNumStops >= 0 && (
                            <div
                              className="form-inner mb-20"
                              style={{
                                width: "40vw",
                                margin: "1vmax auto",
                                display: "flex",
                              }}
                            >
                              {[...Array(returnNumStops + 1)].map(
                                (_, index) => (
                                  <div
                                    className="form-inner mb-20"
                                    style={{
                                      width: "40vw",
                                      margin: "1vmax auto",
                                      display: "flex",
                                    }}
                                  >
                                    <div
                                      key={index}
                                      style={{ marginRight: "1rem" }}
                                    >
                                      <h4>Travel {index + 1} Details:</h4>
                                      <div className="form-inner mb-20">
                                        <input
                                          type="text"
                                          placeholder={`${transportMode} Name`}
                                          value={
                                            returnModeDetails[index]?.name || ""
                                          }
                                          onChange={(e) =>
                                            handleReturnModeDetailsChange(
                                              index,
                                              "name",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="form-inner mb-20">
                                        <input
                                          type="text"
                                          placeholder={`${transportMode} Number`}
                                          value={
                                            returnModeDetails[index]?.number ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            handleReturnModeDetailsChange(
                                              index,
                                              "number",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="form-inner mb-20">
                                        <input
                                          type="text"
                                          placeholder={`${transportMode} From`}
                                          value={
                                            returnModeDetails[index]?.from || ""
                                          }
                                          onChange={(e) =>
                                            handleReturnModeDetailsChange(
                                              index,
                                              "from",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <div className="form-inner mb-20">
                                        <input
                                          type="text"
                                          placeholder={`${transportMode} Departure Time`}
                                          value={
                                            returnModeDetails[index]
                                              ?.departureTime || ""
                                          }
                                          onChange={(e) =>
                                            handleReturnModeDetailsChange(
                                              index,
                                              "departureTime",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="form-inner mb-20">
                                        <input
                                          type="text"
                                          placeholder={`${transportMode} To`}
                                          value={
                                            returnModeDetails[index]?.to || ""
                                          }
                                          onChange={(e) =>
                                            handleReturnModeDetailsChange(
                                              index,
                                              "to",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <div className="form-inner mb-20">
                                        <input
                                          type="text"
                                          placeholder={`${transportMode} Arrival Time`}
                                          value={
                                            returnModeDetails[index]
                                              ?.arrivalTime || ""
                                          }
                                          onChange={(e) =>
                                            handleReturnModeDetailsChange(
                                              index,
                                              "arrivalTime",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </>
                      )}
                      <button
                        type="submit"
                        style={{
                          width: "40vw",
                          margin: "auto",
                          display: "block",
                        }}
                        className="login-btn mb-25"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default page;
