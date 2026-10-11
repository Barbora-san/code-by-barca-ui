// ───────────────────────────── Základy ─────────────────────────────
export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button";
export { Badge, Tag } from "./components/Badge";
export type { BadgeProps, BadgeVariant, TagProps } from "./components/Badge";
export { Divider } from "./components/Divider";
export type { DividerProps } from "./components/Divider";
export { Kbd } from "./components/Kbd";
export { Chip } from "./components/Chip";
export type { ChipProps } from "./components/Chip";
export { Typewriter } from "./components/Typewriter";
export type { TypewriterProps } from "./components/Typewriter";
export { Reveal } from "./components/Reveal";
export type { RevealProps } from "./components/Reveal";
export { SectionHeading } from "./components/SectionHeading";
export type { SectionHeadingProps } from "./components/SectionHeading";

// ───────────────────────────── Formuláře ─────────────────────────────
export { Field, Input, Textarea, Select } from "./components/Field";
export type { FieldProps, InputProps, TextareaProps, SelectProps } from "./components/Field";
export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";
export { Radio } from "./components/Radio";
export type { RadioProps, RadioOption } from "./components/Radio";
export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";
export { Slider } from "./components/Slider";
export type { SliderProps } from "./components/Slider";
export { TagInput } from "./components/TagInput";
export type { TagInputProps } from "./components/TagInput";
export { InputOTP } from "./components/InputOTP";
export type { InputOTPProps } from "./components/InputOTP";
export { FileUpload, parseSize } from "./components/FileUpload";
export type { FileUploadProps } from "./components/FileUpload";
export { DateTimePicker } from "./components/DateTimePicker";
export type { DateTimePickerProps } from "./components/DateTimePicker";
export { ContactForm, DEFAULT_CONTACT_LABELS } from "./components/ContactForm";
export type { ContactFormProps, ContactFormValues, ContactFormLabels } from "./components/ContactForm";
export { Toggle, ToggleGroup } from "./components/Toggle";
export type { ToggleProps, ToggleGroupProps, ToggleGroupItem } from "./components/Toggle";

// ───────────────────────────── Zobrazení ─────────────────────────────
export { Card, CardMedia, CardBody } from "./components/Card";
export type { CardProps } from "./components/Card";
export { StatCard } from "./components/StatCard";
export type { StatCardProps } from "./components/StatCard";
export { Avatar, AvatarGroup } from "./components/Avatar";
export type { AvatarProps, AvatarGroupProps, AvatarStatus } from "./components/Avatar";
export { Skeleton, ProjectCardSkeleton, SkillCardSkeleton, SkeletonGrid } from "./components/Skeleton";
export type { SkeletonGridProps } from "./components/Skeleton";
export type { SkeletonProps } from "./components/Skeleton";
export { Progress } from "./components/Progress";
export type { ProgressProps } from "./components/Progress";
export { SkillCard } from "./components/SkillCard";
export type { SkillCardProps } from "./components/SkillCard";
export { SkillLevelBar, DEFAULT_SKILL_LEVELS } from "./components/SkillLevelBar";
export type { SkillLevelBarProps } from "./components/SkillLevelBar";
export { ProjectCard } from "./components/ProjectCard";
export type { ProjectCardProps } from "./components/ProjectCard";
export { Timeline } from "./components/Timeline";
export type { TimelineEntry } from "./components/Timeline";
export { InfoRow, SocialLinks } from "./components/InfoRow";
export type { InfoRowProps, SocialLink } from "./components/InfoRow";
export { CodeBlock } from "./components/CodeBlock";
export type { CodeBlockProps } from "./components/CodeBlock";
export { LazyImage } from "./components/LazyImage";
export type { LazyImageProps } from "./components/LazyImage";
export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

// ───────────────────────────── Zpětná vazba ─────────────────────────────
export { Alert } from "./components/Alert";
export type { AlertProps, AlertVariant } from "./components/Alert";
export { AlertBar } from "./components/AlertBar";
export type { AlertBarProps, AlertBarVariant } from "./components/AlertBar";
export { Toaster, showToast, dismissToast, toast } from "./components/Toast";
export type { ToastOptions, ToastVariant, ToasterProps } from "./components/Toast";
export { NotificationBadge } from "./components/NotificationBadge";
export type { NotificationBadgeProps } from "./components/NotificationBadge";
export { NotificationPopover } from "./components/NotificationPopover";
export type { NotificationPopoverProps, NotificationItem } from "./components/NotificationPopover";

// ───────────────────────────── Překryvy ─────────────────────────────
export { Dialog, Modal } from "./components/Dialog";
export type { DialogProps, ModalProps } from "./components/Dialog";
export { AlertDialog } from "./components/AlertDialog";
export type { AlertDialogProps, AlertDialogVariant } from "./components/AlertDialog";
export { messageBox, MessageBoxHost } from "./components/MessageBox";
export type { MessageBoxOptions } from "./components/MessageBox";
export { Sheet, Drawer } from "./components/Sheet";
export type { SheetProps } from "./components/Sheet";
export { Lightbox, useLightbox } from "./components/Lightbox";
export type { LightboxProps, LightboxItem } from "./components/Lightbox";
export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";
export { Popover } from "./components/Popover";
export type { PopoverProps } from "./components/Popover";
export { HoverCard } from "./components/HoverCard";
export type { HoverCardProps } from "./components/HoverCard";
export { Dropdown } from "./components/Dropdown";
export type { DropdownProps } from "./components/Dropdown";
export { ContextMenu } from "./components/ContextMenu";
export type { ContextMenuProps } from "./components/ContextMenu";
export { MenuList } from "./components/Menu";
export type { MenuItem, MenuListProps } from "./components/Menu";

// ───────────────────────────── Navigace a lišty ─────────────────────────────
export { Navbar } from "./components/Navbar";
export type { NavbarProps, NavItem } from "./components/Navbar";
export { Sidebar } from "./components/Sidebar";
export type { SidebarProps, SidebarItem, SidebarGroup } from "./components/Sidebar";
export { Menubar } from "./components/Menubar";
export type { MenubarProps, MenubarMenu } from "./components/Menubar";
export { Tabs } from "./components/Tabs";
export type { TabsProps, TabItem } from "./components/Tabs";
export { Breadcrumb } from "./components/Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/Breadcrumb";
export { Pagination, getPageRange } from "./components/Pagination";
export type { PaginationProps } from "./components/Pagination";
export { Stepper } from "./components/Stepper";
export type { StepperProps, StepperStep } from "./components/Stepper";
export { Accordion } from "./components/Accordion";
export type { AccordionProps, AccordionItem } from "./components/Accordion";
export { Collapsible } from "./components/Collapsible";
export type { CollapsibleProps } from "./components/Collapsible";
export { ScrollProgress } from "./components/ScrollProgress";
export type { ScrollProgressProps } from "./components/ScrollProgress";
export { SearchBar } from "./components/SearchBar";
export type { SearchBarProps } from "./components/SearchBar";
export { SearchAutocomplete } from "./components/SearchAutocomplete";
export type { SearchAutocompleteProps, AutocompleteItem } from "./components/SearchAutocomplete";
export { CookieBanner, getCookieConsent, COOKIE_CONSENT_KEY, COOKIE_CONSENT_EVENT, COOKIE_OPEN_EVENT, DEFAULT_COOKIE_TEXTS } from "./components/CookieBanner";
export type { CookieBannerProps, CookieConsent, CookieBannerTexts } from "./components/CookieBanner";

// ───────────────────────────── Filtrování ─────────────────────────────
export { FilterBar, DEFAULT_FILTER_LABELS } from "./components/FilterBar";
export type { FilterBarProps, FilterBarLabels } from "./components/FilterBar";
export { FilterPills } from "./components/FilterPills";
export type { FilterPillsProps, FilterPillOption } from "./components/FilterPills";
export { FilterDropdown } from "./components/FilterDropdown";
export type { FilterDropdownProps, FilterOption } from "./components/FilterDropdown";
export { useFilter, normalizeText } from "./hooks/useFilter";
export type { UseFilterOptions, FilterDef, SortDef, FilterState, FilterChipModel } from "./hooks/useFilter";

// ───────────────────────────── Data a layout ─────────────────────────────
export { Table } from "./components/Table";
export type { TableProps, TableColumn } from "./components/Table";
export { Calendar } from "./components/Calendar";
export type { CalendarProps, DateRange } from "./components/Calendar";
export { DatePicker } from "./components/DatePicker";
export type { DatePickerProps } from "./components/DatePicker";
export { DateRangePicker } from "./components/DateRangePicker";
export type { DateRangePickerProps } from "./components/DateRangePicker";
export { Carousel } from "./components/Carousel";
export type { CarouselProps } from "./components/Carousel";
export { Resizable } from "./components/Resizable";
export type { ResizableProps } from "./components/Resizable";
export { ScrollArea } from "./components/ScrollArea";
export type { ScrollAreaProps } from "./components/ScrollArea";
export { FAB } from "./components/FAB";
export type { FABProps } from "./components/FAB";

// ───────────────────────────── Ikony, hooky, utility ─────────────────────────────
export * from "./components/Icons";
export { useScrollReveal } from "./hooks/useScrollReveal";
export type { UseScrollRevealOptions } from "./hooks/useScrollReveal";
export { useLockBodyScroll } from "./hooks/useLockBodyScroll";
export { useEscape } from "./hooks/useEscape";
export { Floating, useClickOutside, useControllable } from "./lib/floating";
export type { FloatingProps, Side, Align } from "./lib/floating";
export { CbbProvider, useLinkComponent } from "./lib/link";
export type { CbbProviderProps } from "./lib/link";
export { cn } from "./lib/cn";

// ───────────────────────────── Efekty a interaktivní prvky ─────────────────────────────
export { FlipCard } from "./components/FlipCard";
export type { FlipCardProps } from "./components/FlipCard";
export { TiltCard, TiltLayer } from "./components/TiltCard";
export type { TiltCardProps, TiltLayerProps } from "./components/TiltCard";
export { BeforeAfter } from "./components/BeforeAfter";
export type { BeforeAfterProps } from "./components/BeforeAfter";
export { Folder } from "./components/Folder";
export type { FolderProps, FolderItem } from "./components/Folder";
export { Wallet3D } from "./components/Wallet3D";
export type { Wallet3DProps, WalletCard } from "./components/Wallet3D";
export { FloatingInput } from "./components/FloatingInput";
export type { FloatingInputProps } from "./components/FloatingInput";
export { Marquee } from "./components/Marquee";
export type { MarqueeProps, MarqueeItem } from "./components/Marquee";
export { TodoList } from "./components/TodoList";
export type { TodoListProps, TodoItem, TodoPriority, TodoListLabels } from "./components/TodoList";
export { DataTable } from "./components/DataTable";
export type { DataTableProps, DataColumn, DataTableLabels } from "./components/DataTable";
export { AudioVisualizer } from "./components/AudioVisualizer";
export type { AudioVisualizerProps } from "./components/AudioVisualizer";

// ───────────────────────────── Grafy a platby ─────────────────────────────
export { AreaChart, LineChart, BarChart, RadarChart } from "./components/Charts";
export type { ChartProps, ChartDatum, LineChartProps, RadarChartProps } from "./components/Charts";
export { PaymentSummary } from "./components/PaymentSummary";
export type { PaymentSummaryProps, PaymentLine, PaymentSummaryLabels } from "./components/PaymentSummary";
export { PromoQRCard } from "./components/PromoQRCard";
export type { PromoQRCardProps } from "./components/PromoQRCard";

// ───────────────────────────── Základy – loader, vstupy, hooky ─────────────────────────────
export { Spinner } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";
export { NumberInput } from "./components/NumberInput";
export type { NumberInputProps } from "./components/NumberInput";
export { PasswordInput } from "./components/PasswordInput";
export type { PasswordInputProps } from "./components/PasswordInput";
export { Rating } from "./components/Rating";
export type { RatingProps } from "./components/Rating";
export { MultiSelect } from "./components/MultiSelect";
export type { MultiSelectProps, MultiSelectOption } from "./components/MultiSelect";
export { useDebounce } from "./hooks/useDebounce";
export { useMediaQuery } from "./hooks/useMediaQuery";
export { useLocalStorage } from "./hooks/useLocalStorage";
export { useCopyToClipboard } from "./hooks/useCopyToClipboard";
export { useDisclosure } from "./hooks/useDisclosure";
export { useFocusTrap } from "./hooks/useFocusTrap";
export { ThemeToggle } from "./components/ThemeToggle";
export type { ThemeToggleProps } from "./components/ThemeToggle";
export { CommandPalette } from "./components/CommandPalette";
export type { CommandPaletteProps, CommandItem } from "./components/CommandPalette";
export { useTheme, getThemeInitScript } from "./hooks/useTheme";
export type { ThemeMode, UseThemeOptions } from "./hooks/useTheme";
export { useHotkey } from "./hooks/useHotkey";

export { MarkdownEditor } from "./components/MarkdownEditor";
export type { MarkdownEditorProps, MarkdownEditorLabels, MarkdownTool } from "./components/MarkdownEditor";
export { MarkdownView } from "./components/MarkdownView";
export type { MarkdownViewProps } from "./components/MarkdownView";
export { markdownToHtml } from "./lib/markdown";
export { TableEditor } from "./components/TableEditor";
export type { TableEditorProps, TableEditorLabels, TableData } from "./components/TableEditor";

export { MusicPlayerProvider, useMusicPlayer } from "./components/MusicPlayerProvider";
export type { MusicPlayerProviderProps, MusicPlayerState, MusicPlayerLabels, PlayOptions, Track, RepeatMode } from "./components/MusicPlayerProvider";
export { MusicPlayer } from "./components/MusicPlayer";
export type { MusicPlayerProps } from "./components/MusicPlayer";
export { MiniPlayer } from "./components/MiniPlayer";
export type { MiniPlayerProps } from "./components/MiniPlayer";
export { FullscreenPlayer } from "./components/FullscreenPlayer";
export type { FullscreenPlayerProps } from "./components/FullscreenPlayer";
export { PlayerQueue } from "./components/PlayerQueue";
export type { PlayerQueueProps } from "./components/PlayerQueue";
export { PlayerSeek } from "./components/PlayerSeek";
export type { PlayerSeekProps } from "./components/PlayerSeek";
export { CS_PLAYER_LABELS, formatTime } from "./lib/playerLabels";
export type { PlayerLabels } from "./lib/playerLabels";

