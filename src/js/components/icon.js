import arrowLeftIcon from "@tabler/icons/outline/arrow-left.svg?raw";
import arrowRightIcon from "@tabler/icons/outline/arrow-right.svg?raw";
import checkIcon from "@tabler/icons/outline/check.svg?raw";
import chevronRightIcon from "@tabler/icons/outline/chevron-right.svg?raw";
import usersIcon from "@tabler/icons/outline/users.svg?raw";
import calendarIcon from "@tabler/icons/outline/calendar.svg?raw";
import clockIcon from "@tabler/icons/outline/clock.svg?raw";
import userIcon from "@tabler/icons/outline/user.svg?raw";

const icons = {
  "arrow-left": arrowLeftIcon,
  "arrow-right": arrowRightIcon,
  "chevron-right": chevronRightIcon,
  check: checkIcon,
  users: usersIcon,
  calendar: calendarIcon,
  clock: clockIcon,
  user: userIcon,
};

export function renderIcon(name) {
  return icons[name] ?? "";
}
