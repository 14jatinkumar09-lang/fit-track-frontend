export function Button({label , onClick}) {
    return <div className="m-6">
        <button className="border w-full rounded-md py-2 text-white bg-blue-500 hover:cursor-pointer"
        onClick={onClick}>
{label}
        </button>
    </div>
}