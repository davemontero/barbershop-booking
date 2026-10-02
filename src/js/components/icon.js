import arrowLeftIcon from "@tabler/icons/outline/arrow-left.svg?raw";
import arrowRightIcon from "@tabler/icons/outline/arrow-right.svg?raw";
import checkIcon from "@tabler/icons/outline/check.svg?raw";
import chevronRightIcon from "@tabler/icons/outline/chevron-right.svg?raw";
import usersIcon from "@tabler/icons/outline/users.svg?raw";
import calendarIcon from "@tabler/icons/outline/calendar.svg?raw";
import clockIcon from "@tabler/icons/outline/clock.svg?raw";
import userIcon from "@tabler/icons/outline/user.svg?raw";
import loaderIcon from "@tabler/icons/outline/loader-2.svg?raw";
import alertIcon from "@tabler/icons/outline/alert-circle.svg?raw";
import scissorsIcon from "@tabler/icons/outline/scissors.svg?raw";
import mapPinIcon from "@tabler/icons/outline/map-pin.svg?raw";
import calendarPlusIcon from "@tabler/icons/outline/calendar-plus.svg?raw";
import homeIcon from "@tabler/icons/outline/home.svg?raw";
import externalLinkIcon from "@tabler/icons/outline/external-link.svg?raw";
import loader2Icon from "@tabler/icons/outline/loader-2.svg?raw";

const icons = {
  "arrow-left": arrowLeftIcon,
  "arrow-right": arrowRightIcon,
  "chevron-right": chevronRightIcon,
  check: checkIcon,
  users: usersIcon,
  calendar: calendarIcon,
  clock: clockIcon,
  user: userIcon,
  loader: loaderIcon,
  alert: alertIcon,
  scissors: scissorsIcon,
  "map-pin": mapPinIcon,
  "calendar-plus": calendarPlusIcon,
  home: homeIcon,
  "external-link": externalLinkIcon,
  "loader-2": loader2Icon,
};

export function renderIcon(name) {
  return icons[name] ?? "";
}
