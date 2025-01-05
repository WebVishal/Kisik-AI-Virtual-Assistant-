import Link from "next/link";
import Image from "next/image";
interface CardProps {
    id: string;
    title: string;
    url: string;

}

const Card: React.FC<CardProps> = ({ id, title, url }) => {
    return (
        <Link href="#" className="collection-card">
            <Image
                src={url}
                alt={title}
                width={300}
                height={300}
                layout="responsive"
            />
            <div className="flex justify-between items-center">
                <h3>{title}-{id}</h3>
            </div>
        </Link>
    );
};

export default Card;