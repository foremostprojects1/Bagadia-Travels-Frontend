"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../app/loading";

const CabUserView = () => {
  const [cabs, setCabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const TaxiIcon = ({ size = 32, color = "var(--primary-color1)" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.92 6H17l-1.59-3.17A2 2 0 0013.59 1H10.4a2 2 0 00-1.82 1.17L7 6H5.08A2.09 2.09 0 003 8v7a2 2 0 002 2v2a1 1 0 001 1h1a1 1 0 001-1v-2h8v2a1 1 0 001 1h1a1 1 0 001-1v-2a2 2 0 002-2V8a2.09 2.09 0 00-2.08-2zM10.4 3h3.19l1 2H9.37zM6 14a2 2 0 112-2 2 2 0 01-2 2zm12 0a2 2 0 112-2 2 2 0 01-2 2z" />
    </svg>
  );

  // Fetch all cabs
  const getCabs = async () => {
    try {
      const res = await axios.get(
        "https://bagadia-travels.onrender.com/api/v1/cab/active"
      );
      setCabs(res.data.data || res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCabs();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div
            className="row justify-content-center align-items-start"
            style={{ minHeight: "70vh", overflowX: "hidden" }}
          >
            {cabs.length === 0 ? (
              <div className="col-12 text-center mt-5">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
                  alt="No Data"
                  style={{ width: "120px", opacity: 0.8 }}
                />
                <h4 className="mt-3" style={{ color: "var(--title-color)" }}>
                  Coming Soon...
                </h4>
                <p className="text-muted">
                  New cab routes will be added shortly.
                </p>
              </div>
            ) : (
              cabs.map((cab) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  style={{height:"40vh"}}
                  key={cab._id}
                >
                  <div className="feature-card shadow-sm border-0 h-100">
                    {/* Icon */}
                    <div className="feature-card-icon text-center">
                      <TaxiIcon size={40} color="var(--primary-color1)" />
                    </div>

                    {/* Content */}
                    <div className="feature-card-content p-3">
                      <h6
                        className="fw-bold"
                        style={{
                          fontFamily: "var(--font-rubik)",
                          color: "var(--title-color)",
                        }}
                      >
                        {cab.source} → {cab.destination}
                      </h6>

                      <p
                        className="small mb-2"
                        style={{
                          color: "var(--text-color)",
                          fontFamily: "var(--font-jost)",
                        }}
                      >
                        Route availability with multiple cab options.
                      </p>
                      <div
                        style={{
                          maxHeight: cab.cars.length > 2 ? "80px" : "none",
                          overflowY: cab.cars.length > 2 ? "auto" : "visible",
                        }}
                      >
                        {cab.cars.map((car, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between mb-1"
                          >
                            <span style={{ fontFamily: "var(--font-jost)" }}>
                              {car.carName}
                            </span>
                            <span className="fw-bold text-primary">
                              ₹{car.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CabUserView;
