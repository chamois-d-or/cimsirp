import { components as ecommerceComponents } from '../slices/ecommerce/index'
import { components as marketingComponents } from '../slices/marketing/index'
import React from 'react';

const __allComponents = { ...ecommerceComponents, ...marketingComponents }

import state from "../.slicemachine/libraries-state.json";

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  ViewListIcon,
  XIcon,
} from '@heroicons/react/outline'

import { Disclosure } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SliceListPage = () => {
  const librariesFolders = Object.keys(state)
  const librarySlices = librariesFolders.map((library) => {
    return {
      libraryname: library,
      slices: Object.values(state[library].components).map((slice) => {
        return {
          id: slice.model.id,
          variations: Object.values(slice.mocks)
        }
      })
    }
  })
  // console.log(librarySlices)
  const __allSlices = librarySlices.map(library => library.slices).flat().map(slice => slice.variations).flat()

  // const ecommerceSlices = Object.values(state["slices/ecommerce"].components).map(slice => Object.values(slice.mocks)).flat()
  // const marketingSlices = Object.values(state["slices/marketing"].components).map(slice => Object.values(slice.mocks)).flat()

  const __PRODUCTION__ = process.env.NODE_ENV === "production";
  const defaultComponent = __PRODUCTION__ ? () => null : ({
    slice
  }) => {
    const type = "slice_type" in slice ? slice.slice_type : slice.type;
    return /* @__PURE__ */ React.createElement("section", {
      "data-slice-zone-todo-component": "",
      "data-slice-type": type
    }, "Could not find a component for Slice type \u201C", type, "\u201D");
  };

  const renderedSlices = __allSlices.map((slice, index) => {
    const type = slice.slice_type;

    let Comp =
      __allComponents[type] || defaultComponent;

    const key =
      "slice_type" in slice && slice.slice_type
        ? slice.slice_type
        : `${index}-${JSON.stringify(slice)}`;

    return (
      <div className="p-20" id={slice.slice_type + "__" + slice.variation} key={key}>
        <div className="border-b border-gray-200 pb-5 mb-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{slice.slice_type}</h3>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            {slice.variation}
          </p>
        </div>
        <div className="isolate bg-white rounded-md">
          <Comp
            slice={slice}
            index={index}
          // slices={__allSlices}
          />
        </div>
      </div>
    );
  })
  const renderedSlicesNav = librarySlices.map(library => {
    return {
      name: library.libraryname,
      current: false,
      children: library.slices.map((slice, index) => {
        return {
          name: slice.id,
          children: slice.variations,
          current: false
          // href: "#" + slice.slice_type + "__" + slice.variation
        }
      })
    }
  })

  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
                      alt="Your Company"
                    />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {renderedSlicesNav.map((library) => (
                        <a
                          key={library.name}
                          href={library.href}
                          className={classNames(
                            library.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                          )}
                        >
                          {library.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <img
                className="h-8 w-auto"
                src="/favicon.png"
                alt="Prismic"
              />
            </div>
            <div className="mt-5 flex flex-grow flex-col">
              <nav className="flex-1 space-y-1 bg-white px-2" aria-label="Sidebar">
                {renderedSlicesNav.map((library) =>
                  !library.children ? (
                    <div key={library.name}>
                      <a
                        href={library.href}
                        className={classNames(
                          library.current
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium rounded-md'
                        )}
                      >
                        {library.name}
                      </a>
                    </div>
                  ) : (
                    <Disclosure as="div" key={library.name} className="space-y-1">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              library.current
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                              'group w-full flex items-center pr-2 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            )}
                          >
                            <svg
                              className={classNames(
                                open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                                'mr-2 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400'
                              )}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                            </svg>
                            {library.name}
                          </Disclosure.Button>
                          <Disclosure.Panel className="space-y-1">
                            {library.children.map((slice) => {
                              return (
                                <Disclosure as="div" key={library.name} className="space-y-1">
                                  {({ open }) => (
                                    <>
                                      <Disclosure.Button
                                        className={classNames(
                                          slice.current
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                          'group w-full flex items-center pr-2 py-2 pl-10 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                        )}
                                      >
                                        <svg
                                          className={classNames(
                                            open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                                            'mr-2 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400'
                                          )}
                                          viewBox="0 0 20 20"
                                          aria-hidden="true"
                                        >
                                          <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                                        </svg>
                                        {slice.name}
                                      </Disclosure.Button>
                                      <Disclosure.Panel className="space-y-1">
                                        {
                                          slice.children.map((variation) => {
                                            return (
                                              <a
                                                key={variation.variation}
                                                as="a"
                                                href={"#" + slice.name + "__" + variation.variation}
                                                className="group flex w-full items-center rounded-md py-2 pl-20 pr-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                              >
                                                {variation.variation}
                                              </a>
                                            )
                                          })
                                        }
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                              )
                            }
                            )}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <ViewListIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="m-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Explore your Slice Libraries</h1>
            </div>
          </div>

          <main>
            <div className="">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}
                <>{renderedSlices}</>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SliceListPage;