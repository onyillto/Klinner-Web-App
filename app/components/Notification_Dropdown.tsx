// File: components/Notification_Dropdown.tsx
"use client";
import { useState } from "react";

interface NotificationItemProps {
  icon: string;
  bgColor: string;
  title: string;
  description: string;
}

interface NotificationSection {
  items: NotificationItemProps[];
  title: string;
  date?: string;
}

interface NotificationDropdownProps {
  isNotificationOpen: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  icon,
  bgColor,
  title,
  description,
}) => (
  <div className="flex items-start p-4 bg-gray-50 rounded-lg mb-3">
    <div
      className={`flex items-center justify-center ${bgColor} text-white w-12 h-12 rounded-full mr-3 relative`}
    >
      <span className="text-xl lg:text-2lg">{icon}</span>
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-500"></div>
      <div className="absolute top-1 -left-1 w-2 h-2 rounded-full bg-indigo-300 opacity-70"></div>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-indigo-300 opacity-70"></div>
    </div>
    <div>
      <p className="font-bold text-black">{title}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  </div>
);

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isNotificationOpen,
}) => {
  const todayItems: NotificationItemProps[] = [
    {
      icon: "💰",
      bgColor: "bg-indigo-500",
      title: "Payment Successful!",
      description: "You have made a services payment",
    },
    {
      icon: "🧰",
      bgColor: "bg-pink-500",
      title: "New Category Services!",
      description: "Now the plumbing services is available",
    },
  ];

  const yesterdayItems: NotificationItemProps[] = [
    {
      icon: "🎁",
      bgColor: "bg-yellow-400",
      title: "Today's Special Offers",
      description: "You get a special promo today!",
    },
  ];

  const pastItems: NotificationItemProps[] = [
    {
      icon: "💳",
      bgColor: "bg-indigo-500",
      title: "Credit Card Connected!",
      description: "Credit Card has been linked!",
    },
    {
      icon: "👤",
      bgColor: "bg-green-500",
      title: "Account Setup Successful!",
      description: "Your account has been created!",
    },
  ];

  const notificationsData: NotificationSection[] = [
    { title: "Today", items: todayItems },
    { title: "Yesterday", items: yesterdayItems },
    {
      title: "September 12, 2023",
      items: pastItems,
      date: "September 12, 2023",
    },
  ];

  return (
    <>
      {isNotificationOpen && (
        <div className="px-4 pb-6 max-h-[50vh] overflow-y-auto absolute z-50 top-16 right-4  bg-white w-80 shadow-lg rounded-lg ">
          {notificationsData.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-xl mb-3 mt-2">{section.title}</h3>
              {section.items.map((item, itemIndex) => (
                <NotificationItem
                  key={`${index}-${itemIndex}`}
                  icon={item.icon}
                  bgColor={item.bgColor}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default NotificationDropdown;
