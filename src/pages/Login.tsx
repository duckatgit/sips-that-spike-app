import { useAppContext } from "@/context/appContext";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({ mode: "onChange" });

  const { user, setForceFetch, setUser } = useAppContext();
  const nav = useNavigate();

  useEffect(() => {
    console.log(user);

    if (user) {
      nav("/learn");
    }
  }, [user]);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ILoginForm) => {
    console.log(data);

    localStorage.setItem("email", data.email);
    localStorage.setItem("password", data.password);

    setUser?.(data);

    // setLoading(true);
    // try {
    //   const resp = await api.post("/admin/adminLogIn", data);
    //   const body = resp.data;
    //   if (body.token) {
    //     localStorage.setItem("token", body.token);
    //     setForceFetch && setForceFetch((prev) => !prev);
    //   }
    //   toast.success(body.message || "Login successful");
    //   navigate("/learn");
    // } catch (err: any) {
    //   toast.error(
    //     err?.response?.data?.message || err.message || "Login failed"
    //   );
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center ">
      <div className="max-w-md   mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                  message:
                    "Include uppercase letter, number, and special character",
                },
              })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition pr-10"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} style={{ color: "#0c0d0e" }} />
              ) : (
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  style={{ color: "#0c0d0e" }}
                />
              )}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* <div>
          <a href="/forgetPassword">Forget Password</a>
        </div> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
