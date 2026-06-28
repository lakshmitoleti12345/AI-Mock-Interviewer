import { Link } from "react-router-dom";



const variants = {

  primary:

    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/30",

  secondary:

    "border border-slate-600 text-slate-200 hover:border-blue-500/60 hover:text-white hover:bg-slate-800/60",

  ghost: "text-slate-300 hover:text-white hover:bg-slate-800/60",

};



const sizes = {

  sm: "px-4 py-2 text-sm",

  md: "px-5 py-2.5 text-sm",

  lg: "px-7 py-3 text-base",

};



const baseClass =

  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950";



export default function Button({

  children,

  variant = "primary",

  size = "md",

  className = "",

  href,

  to,

  ...props

}) {

  const classes = `${baseClass} ${variants[variant]} ${sizes[size]} ${className}`;

  const route = to || href;



  if (route) {

    if (route.startsWith("http")) {

      return (

        <a href={route} className={classes} {...props}>

          {children}

        </a>

      );

    }

    return (

      <Link to={route} className={classes} {...props}>

        {children}

      </Link>

    );

  }



  return (

    <button className={classes} {...props}>

      {children}

    </button>

  );

}


