import DateSheetForm from '@/components/form/DateSheetForm';

export function BookingUser() {
  return (
    <div className="fixed left-0 right-0 bottom-22 px-4 z-40">
      <DateSheetForm fullWidth>
        <button
          className="relative w-full h-14 bg-primary text-white dark:text-black rounded-xl shadow-lg"
          style={{
            WebkitMaskImage:
              'radial-gradient(66px 36px at 50% 120%, transparent 36px, white 37px)',
            maskImage:
              'radial-gradient(66px 36px at 50% 120%, transparent 36px, white 37px)',
          }}
        >
          Reservar clase
        </button>
      </DateSheetForm>
    </div>
  );
}
