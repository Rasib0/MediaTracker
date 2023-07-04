import React from "react";
import Link from "next/link";
import { currentPage } from "../../common/types";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";

type Props = {
  currentPage: currentPage;
};


// TODO make menu state stick using useLocalStorage hook
export const Navbar = (props: Props) => {
  const [userButtonClicked, setUserButtonClicked] = useState(false);
  const [libButtonClick, setLibButtonClick] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const handleUserButtonClick = () => {
    setUserButtonClicked(!userButtonClicked);
  };

  const handleLibButtonClick = () => {
    setLibButtonClick(!libButtonClick);
  };

  const handleMenuMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={handleMenuMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Mobile menu, show/hide based on menu state. */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Image
                src="/images/logo.svg"
                alt="Your Company"
                width={40}
                height={40}
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {props.currentPage === currentPage.books ? (
                  <Link
                    href="/book/all"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                    aria-current="page"
                  >
                    Books
                  </Link>
                ) : (
                  <Link
                    href="/book/all"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Books
                  </Link>
                )}
                {props.currentPage === currentPage.movies ? (
                  <Link
                    href="/movie/all"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Movies
                  </Link>
                ) : (
                  <Link
                    href="/movie/all"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Movies
                  </Link>
                )}
                {props.currentPage === currentPage.yourbooks ? (
                  <Link
                    href="/library/books"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Your Books
                  </Link>
                ) : (
                  <Link
                    href="/library/books"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Your Books
                  </Link>
                )}
                {props.currentPage === currentPage.yourmovies ? (
                  <Link
                    href="/library/movies"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Your Movies
                  </Link>
                ) : (
                  <Link
                    href="/library/movies"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Your Movies
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center border border-red-700 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button>
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={handleUserButtonClick}
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="h-8 w-8 rounded-full"
                    src="/images/avatar.png"
                    alt="Your avatar"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
              {userButtonClicked && (
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full px-4 py-2 text-sm font-bold text-gray-700 dark:text-red-600 dark:hover:text-red-900"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => [signOut()]}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {openMenu && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {props.currentPage === currentPage.books ? (
              <Link
                href="/book/all"
                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                aria-current="page"
              >
                Books
              </Link>
            ) : (
              <Link
                href="/book/all"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                aria-current="page"
              >
                Books
              </Link>
            )}
            {props.currentPage === currentPage.movies ? (
              <Link
                href="/movie/all"
                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              >
                Movies
              </Link>
            ) : (
              <Link
                href="/movie/all"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Movies
              </Link>
            )}
            {props.currentPage === currentPage.yourbooks ? (
              <Link
                href="/library/books"
                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              >
                Your Books
              </Link>
            ) : (
              <Link
                href="/library/books"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Your Books
              </Link>
            )}
            {props.currentPage === currentPage.yourmovies ? (
              <Link
                href="/library/movies"
                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              >
                Your Movies
              </Link>
            ) : (
              <Link
                href="/library/movies"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Your Movies
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
