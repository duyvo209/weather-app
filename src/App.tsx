import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import "./App.css";
import { debounceTime, map } from "rxjs/operators";

function App() {
  const APP_ID = "1754220713e276938e31b1905ed58e49";

  const [cityName, setCityName] = React.useState();
  const [weather, setWeather] = React.useState();
  const [iconWeather, setIconWeather] = React.useState();
  const [temperature, setTemperature] = React.useState(0);

  const { register, handleSubmit } = useForm();

  const [debounceKeyword, keyword, setKeyword] = useDebounce<string>("", 1000);

  const [refresh, setRefresh] = React.useState<boolean>();

  // const onSubmit = (data: any) => {
  //   fetch(
  //     `https://api.openweathermap.org/data/2.5/weather?q=${data.search}&appid=${APP_ID}&units=metric&lang=vi`
  //   ).then(async (res) => {
  //     const data = await res.json();
  //     console.log(data);

  //     setCityName(data.name);
  //     setWeather(data.weather[0].description);
  //     setIconWeather(data.weather[0].icon);
  //     setTemperature(Math.round(data.main.temp));
  //   });
  // };

  function useDebounce<T>(
    initialValue: T,
    time: number
  ): [T, T, React.Dispatch<T>] {
    const [value, setValue] = React.useState<T>(initialValue);
    const [debouncedValue, setDebouncedValue] = React.useState<T>(initialValue);
    React.useEffect(() => {
      const debounce = setTimeout(() => {
        setDebouncedValue(value);
      }, time);
      return () => {
        clearTimeout(debounce);
      };
    }, [value, time]);
    return [debouncedValue, value, setValue];
  }

  const fetchApi = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${debounceKeyword}&appid=${APP_ID}&units=metric&lang=vi`
    ).then(async (res) => {
      const data = await res.json();
      console.log(data);

      setCityName(data.name);
      setWeather(data.weather[0].description);
      setIconWeather(data.weather[0].icon);
      setTemperature(Math.round(data.main.temp));
    });
    setRefresh(true);
    console.log(refresh);
  };

  const handleOnChange = (e: any) => {
    setKeyword(e.target.value);
  };

  React.useEffect(() => {
    if (debounceKeyword) {
      fetchApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceKeyword]);

  var options: any = {
    weekday: "long",
    // year: "numeric",
    // month: "long",
    // day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  };
  var today = new Date().toLocaleTimeString("vi-vn", options);

  return (
    <div className="App">
      <div className="container">
        <form action="">
          <div className="main">
            <br />

            <div className="search">
              <TextField
                {...register("search")}
                style={{ width: "100%" }}
                id="input-with-icon-textfield"
                placeholder="Tìm kiếm thành phố"
                value={keyword}
                onChange={(e: any) => handleOnChange(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      // onClick={handleSubmit(onSubmit)}
                      position="start"
                    >
                      <SearchIcon style={{ cursor: "pointer" }} />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
            </div>
            {cityName ? (
              <div className="info">
                <Typography
                  className="cityName"
                  style={{ fontSize: "20px", fontWeight: "bold" }}
                >
                  {cityName || "--"}
                </Typography>
                <Typography>{today}</Typography>
                <Typography>{weather || "--"}</Typography>
                {iconWeather ? (
                  <img
                    src={`http://openweathermap.org/img/wn/${iconWeather}@2x.png`}
                  />
                ) : (
                  <Typography>--</Typography>
                )}

                <Typography style={{ fontSize: "56px" }}>
                  {temperature}°
                </Typography>
              </div>
            ) : (
              <></>
            )}
          </div>
        </form>

        <div className="footer"></div>
      </div>
    </div>
  );
}

export default App;
