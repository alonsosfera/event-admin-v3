import React, { useEffect, useState } from "react"

const CounterInvitation = ({ date }) => {
  const [countdownValues, setCountdownValues] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24

    const countDownDate = new Date(date.slice(0, -1)).getTime()

    const intervalId = setInterval(() => {
      const now = new Date().getTime()
      const distance = countDownDate - now

      if (distance < 0) {
        clearInterval(intervalId)
        setCountdownValues(({
          ...countdownValues,
          isExpired: true
        }))
      } else {
        setCountdownValues({
          days: Math.floor(distance / day),
          hours: Math.floor((distance % day) / hour),
          minutes: Math.floor((distance % hour) / minute),
          seconds: Math.floor((distance % minute) / second),
          isExpired: false
        })
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [date])

  return (
    <div
      className="container"
      style={{
        borderRadius: "8px",
        width: "auto",
        backgroundColor: "rgba(255, 255, 255, 0.7)"
      }}>
      <h1
        id="headline"
        style={{
          textAlign: "center",
          fontFamily: "Merienda, cursive",
          color: "#03150A",
          textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
        }}>
        Tiempo restante
      </h1>
      {!countdownValues.isExpired &&
        <div
          id="countdown"
          style={{ display: "flex", justifyContent: "center" }}>
          {countdownValues.days > 0 &&
            <div style={{ textAlign: "center", margin: "0 10px" }}>
              <span
                style={{
              fontSize: "25px",
              fontWeight: "bold",
              color: "#03150A",
              fontFamily: "Merienda, cursive",
              textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
            }}>
                {countdownValues.days}
              </span>
              <span
                style={{
              fontSize: "17px",
              color: "#666",
              textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
            }}>
                Dias
              </span>
            </div>
          }
          {countdownValues.hours > 0 &&
            <div style={{ textAlign: "center", margin: "0 10px" }}>
              <span
                style={{
                fontSize: "25px",
                fontWeight: "bold",
                color: "#03150A",
                fontFamily: "Merienda, cursive",
                textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
              }}>
                {countdownValues.hours}
              </span>
              <span
                style={{
                fontSize: "17px",
                color: "#666",
                textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
              }}>
                Horas
              </span>
            </div>
          }
          {countdownValues.minutes > 0 &&
            <div style={{ textAlign: "center", margin: "0 10px" }}>
              <span
                style={{
                fontSize: "25px",
                fontWeight: "bold",
                color: "#03150A",
                fontFamily: "Merienda, cursive",
                textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
              }}>
                {countdownValues.minutes}
              </span>
              <span
                style={{
                fontSize: "17px",
                color: "#666",
                textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
              }}>
                Minutos
              </span>
            </div>
          }
          <div style={{ textAlign: "center", margin: "0 10px" }}>
            <span
              style={{
              fontSize: "25px",
              fontWeight: "bold",
              color: "#03150A",
              fontFamily: "Merienda, cursive",
              textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
            }}>
              {countdownValues.seconds}
            </span>
            <span
              style={{
              fontSize: "17px",
              color: "#666",
              textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
            }}>
              Segundos
            </span>
          </div>
        </div>
      }
      {countdownValues.isExpired && (
        <div id="content" style={{ display: "block", alignContent: "center",alignItems: "center", textAlign: "center" }}>
          <p style={{ fontSize: "30px",fontWeight: "bold", fontFamily: "Merienda, cursive" }}>¡Es Hoy!</p>
        </div>
      )}
    </div>
  )
}
export default CounterInvitation
